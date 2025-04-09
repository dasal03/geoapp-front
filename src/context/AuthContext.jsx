import {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const hasFetchedUser = useRef(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (!token || hasFetchedUser.current) return;

    const fetchUserData = async () => {
      hasFetchedUser.current = true;
      setIsLoading(true);

      try {
        const response = await apiFetch("/get_user_data_by_token", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.responseCode === 200) {
          setUser({
            user_id: response.data.user_id,
            username: response.data.username,
            profile_img: response.data.profile_img || "",
            role_id: response.data.role_id,
            role_name: response.data.role_name,
          });
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, logout]);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/auth", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (data.responseCode === 200 && data.data.token) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setIsAuthenticated(true);
        hasFetchedUser.current = false;
        return { success: true };
      }

      if (data.responseCode === 401) {
        return {
          success: false,
          message: "Credenciales incorrectas. Inténtalo de nuevo.",
        };
      }

      return {
        success: false,
        message: "Error en el servidor. Inténtalo más tarde.",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Error inesperado. Inténtalo más tarde.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

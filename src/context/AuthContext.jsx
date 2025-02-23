import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const response = await apiFetch("/get_user_data_by_token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.responseCode === 200) {
            setUser({
              user_id: response.data.user_id,
              username: response.data.username,
              profile_img: response.data.profile_img || "",
              role_name: response.data.role_name,
            });
          } else if (response.responseCode === 401) {
            logout();
          }
        } catch (error) {
          console.error("Error during fetching user data:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, user, logout]);

  const login = async (username, password) => {
    try {
      const data = await apiFetch("/auth", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (data.responseCode === 200 && data.data.token) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setIsAuthenticated(true);
      } else {
        throw new Error(data.message || "Error logging in.");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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

export const useAuth = () => {
  return useContext(AuthContext);
};

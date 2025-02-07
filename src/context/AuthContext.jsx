import { createContext, useState, useContext, useEffect } from "react";
import apiFetch from "../utils/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          setToken(storedToken);
          setIsAuthenticated(true);

          const response = await apiFetch("/get_user_data_by_token", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.responseCode === 200) {
            setUser({
              user_id: response.data.user_id,
              username: response.data.username,
              role_name: response.data.role_name,
            });
          } else if (response.responseCode === 401) {
            logout();
          }
        } catch (error) {
          console.error("Error during initialization:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

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

        const userResponse = await apiFetch("/get_user_data_by_token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.data.token}`,
          },
        });

        if (userResponse.responseCode === 200) {
          setUser({
            user_id: userResponse.data.user_id,
            username: userResponse.data.username,
            role_name: userResponse.data.role_name,
          });
        } else {
          throw new Error("Error fetching user data.");
        }
      } else {
        throw new Error(data.message || "Error logging in.");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
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

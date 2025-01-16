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
        } catch (error) {
          console.error("Error durante la inicialización:", error);
          logout();
        }
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

        setUser(data.data.user);
        setIsAuthenticated(true);
      } else if (data.responseCode === 401) {
        throw new Error(data.message || "Credenciales inválidas.");
      } else {
        throw new Error(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
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

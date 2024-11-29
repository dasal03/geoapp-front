import React, { createContext, useState, useContext, useEffect } from "react";
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
          const userData = await validateToken(storedToken);
          if (userData) {
            setToken(storedToken);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error durante la inicialización:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await apiFetch("/get_user_data_by_token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al validar el token:", error);
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const data = await apiFetch("/auth", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);

        const userData = await validateToken(data.data.token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          throw new Error("Error al obtener datos del usuario.");
        }
      } else {
        throw new Error(data.message || "Credenciales inválidas.");
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

import React, { createContext, useState, useContext, useEffect } from "react";

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
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:3000/dev/get_user_data_by_token",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        console.warn("Token inválido o expirado");
        return null;
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3000/dev/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.data.token) {
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

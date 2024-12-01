import axios from "axios";
import { BASE_URL } from "./constants";

const apiFetch = async (
  endpoint,
  { token = localStorage.getItem("token"), logout, ...options } = {}
) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await axios({
      method: options.method || "GET",
      url: `${BASE_URL}${endpoint}`,
      headers,
      data: options.body || options.data,
      ...options,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        if (logout) logout();
        throw new Error("No autorizado. Sesión cerrada.");
      }

      const errorMessage =
        error.response.data?.message || "Error en la solicitud.";
      throw new Error(errorMessage);
    }

    console.error("Error en apiFetch:", error);
    throw error;
  }
};

export default apiFetch;

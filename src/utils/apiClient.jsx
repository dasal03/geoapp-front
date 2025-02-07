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

    const { responseCode, responseReason, data, description } = response.data;

    if ([200, 201].includes(responseCode)) {
      return {
        responseCode,
        responseReason,
        data,
        description,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error en apiFetch:", error);

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (logout) logout();
        return {
          responseCode: 401,
          description: "No autorizado. Sesión cerrada.",
        };
      }

      if ([400, 404].includes(status)) {
        return {
          responseCode: status,
          description: data?.description || "Error en la solicitud.",
          data: [],
        };
      }

      return {
        responseCode: status,
        description: data?.description || "Error en la solicitud.",
      };
    }

    return {
      responseCode: 500,
      description: "Error inesperado. Intenta nuevamente.",
    };
  }
};

export default apiFetch;

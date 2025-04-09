import axios from "axios";
import { BASE_URL } from "./constants";

const apiFetch = async (
  endpoint,
  { token = localStorage.getItem("token"), ...options } = {}
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

    return {
      responseCode,
      responseReason,
      data,
      description,
    };
  } catch (error) {
    console.error("Error en apiFetch:", error);

    if (error.response) {
      const { status, data } = error.response;

      return {
        responseCode: status,
        description: data?.description || "Error en la solicitud.",
        data: [],
      };
    }

    return {
      responseCode: 500,
      description: "Error inesperado. Intenta nuevamente.",
    };
  }
};

export default apiFetch;

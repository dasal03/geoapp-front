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

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      if (logout) logout();
      throw new Error("No autorizado. Sesión cerrada.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la solicitud.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en apiFetch:", error);
    throw error;
  }
};

export default apiFetch;

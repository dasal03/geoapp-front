import { useState, useEffect, useRef, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import Validator from "../utils/formValidator";

const useManagementData = () => {
  const [managementData, setManagementData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);

  const { showAlert, showConfirm } = useAlert();

  const fetchManagementData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/get_managements");
      if (response.responseCode === 200) {
        const formattedData = response.data.map((management) => ({
          id: management.management_id,
          ...management,
        }));
        setManagementData(formattedData);
        originalDataRef.current = [...formattedData];
      } else {
        setManagementData([]);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudieron cargar las gestiones.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setManagementData, setLoading]);

  useEffect(() => {
    fetchManagementData();
  }, [fetchManagementData]);

  const validateField = useCallback((field, value) => {
    const validator = new Validator({ [field]: value });
    const result = validator.validateField(field);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? undefined : result.message,
    }));
  }, []);

  const handleChange = useCallback(
    (managementId, field, value) => {
      setManagementData((prev) =>
        prev.map((management) =>
          management.management_id === managementId
            ? { ...management, [field]: value }
            : management
        )
      );
      if (errors[field] !== undefined) {
        validateField(field, value);
      }
    },
    [errors, validateField]
  );

  const sendRequest = useCallback(
    async (
      url,
      options,
      successMessage = null,
      callback,
      shouldRefetch = true
    ) => {
      setLoading(true);
      try {
        const response = await apiFetch(url, options);
        if (response.responseCode === 200 || response.responseCode === 201) {
          if (successMessage) {
            showAlert("success", "Éxito", successMessage, callback);
          }
          if (shouldRefetch) {
            await fetchManagementData();
          }
        } else {
          showAlert(
            "error",
            "Error",
            response.description || "Ocurrió un error."
          );
        }
      } catch {
        showAlert("error", "Error", "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    },
    [fetchManagementData]
  );

  const deleteManagement = useCallback(
    async (managementId, callback) => {
      await sendRequest(
        `/delete_management?management_id=${managementId}`,
        { method: "DELETE" },
        "Gestión eliminada exitosamente.",
        callback
      );
    },
    [sendRequest]
  );

  const confirmDelete = useCallback(
    (managementId) => {
      showConfirm(
        "¿Eliminar gestión?",
        "Esta acción no se puede deshacer.",
        () => {
          deleteManagement(managementId);
        }
      );
    },
    [deleteManagement]
  );

  return {
    managementData,
    errors,
    loading,
    handleChange,
    addManagement: useCallback(
      (newManagement, callback) =>
        sendRequest(
          "/create_management",
          { method: "POST", body: JSON.stringify(newManagement) },
          "Gestión creada correctamente.",
          callback
        ),
      [sendRequest]
    ),
    updateManagement: useCallback(
      (management, callback) =>
        sendRequest(
          "/update_management",
          { method: "POST", body: JSON.stringify(management) },
          "Gestión actualizada exitosamente",
          callback
        ),
      [sendRequest]
    ),
    deleteManagement: confirmDelete,
  };
};

export default useManagementData;

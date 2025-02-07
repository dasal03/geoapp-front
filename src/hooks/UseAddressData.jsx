import { useState, useEffect, useRef, useCallback } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const useAddressData = (userId) => {
  const [addressData, setAddressData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);

  const fetchAddressData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await apiFetch(`/get_address?user_id=${userId}`);
      if (response.responseCode === 200) {
        const formattedData = response.data.map((address) => ({
          id: address.address_id,
          ...address,
        }));
        setAddressData(formattedData);
        originalDataRef.current = formattedData;
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo cargar el perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddressData();
  }, [fetchAddressData]);

  const validateField = useCallback((field, value) => {
    const validator = new Validator({ [field]: value });
    const result = validator.validateField(field);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? undefined : result.message,
    }));
  }, []);

  const handleChange = useCallback(
    (addressId, field, value) => {
      setAddressData((prev) =>
        prev.map((address) =>
          address.address_id === addressId
            ? { ...address, [field]: value }
            : address
        )
      );
      if (errors[field] !== undefined) {
        validateField(field, value);
      }
    },
    [errors, validateField]
  );

  const getModifiedFields = useCallback(
    (address) => {
      const original = originalDataRef.current.find(
        (orig) => orig.address_id === address.address_id
      );
      if (!original) return null;

      const modifiedFields = Object.fromEntries(
        Object.entries(address).filter(
          ([key, value]) =>
            value !== original[key] &&
            !["state_name", "city_name"].includes(key)
        )
      );

      return Object.keys(modifiedFields).length > 0
        ? { address_id: address.address_id, user_id: userId, ...modifiedFields }
        : null;
    },
    [userId]
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
            await fetchAddressData();
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
    [fetchAddressData]
  );

  const setAsPrimary = useCallback(
    async (address, newValue) => {
      const payload = {
        address_id: address.address_id,
        user_id: userId,
        is_principal: newValue ? 1 : 0,
      };

      await sendRequest(
        "/update_address",
        { method: "PUT", body: JSON.stringify(payload) },
        null,
        true
      );
    },
    [sendRequest, userId]
  );

  const updateAddress = useCallback(
    async (address, callback) => {
      const payload = getModifiedFields(address);
      if (!payload) return;
      await sendRequest(
        "/update_address",
        { method: "PUT", body: JSON.stringify(payload) },
        "Dirección actualizada.",
        callback
      );
    },
    [sendRequest, getModifiedFields]
  );

  const addAddress = useCallback(
    async (newAddress, callback) => {
      await sendRequest(
        "/create_address",
        { method: "POST", body: JSON.stringify(newAddress) },
        "Dirección añadida.",
        callback
      );
    },
    [sendRequest]
  );

  const deleteAddress = useCallback(
    async (addressId, callback) => {
      await sendRequest(
        `/delete_address?address_id=${addressId.address_id || addressId}`,
        { method: "DELETE" },
        "Dirección eliminada.",
        callback
      );
    },
    [sendRequest]
  );

  return {
    addressData,
    errors,
    loading,
    handleChange,
    updateAddress,
    setAsPrimary,
    addAddress,
    deleteAddress,
  };
};

export default useAddressData;

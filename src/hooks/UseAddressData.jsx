import { useState, useEffect, useRef, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import Validator from "../utils/formValidator";

const useAddressData = (userId, addressId) => {
  const [addressData, setAddressData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef([]);
  const isProcessingRef = useRef(false);

  const { showAlert, showConfirm } = useAlert();

  const fetchAddressData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      let url = `/get_address?user_id=${userId}`;
      if (addressId) {
        url += `&address_id=${addressId}`;
      }

      const response = await apiFetch(url);
      if (response.responseCode === 200) {
        const formattedData = response.data.map((address) => ({
          id: address.address_id,
          ...address,
        }));
        setAddressData(formattedData);
        originalDataRef.current = formattedData;
        return formattedData;
      } else {
        setAddressData([]);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudieron cargar las direcciones.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId, addressId, setAddressData, setLoading]);

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

  const deleteAddress = useCallback(
    async (addressId) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch(
          `/delete_address?address_id=${addressId}`
        );
        if (response.responseCode === 200) {
          const updatedData = addressData.filter(
            (address) => address.address_id !== addressId
          );
          setAddressData(updatedData);
          originalDataRef.current = updatedData;
          showAlert("success", "Eliminado", "Dirección eliminada.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo eliminar la direccion.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [addressData, setAddressData]
  );

  const confirmDelete = useCallback(
    (addressId) => {
      showConfirm(
        "¿Eliminar dirección?",
        "Esta acción no se puede deshacer.",
        () => {
          deleteAddress(addressId);
        }
      );
    },
    [deleteAddress]
  );

  const setAsPrimary = useCallback(
    async (address, newValue) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const payload = {
          address_id: address.address_id,
          user_id: userId,
          is_principal: newValue ? 1 : 0,
        };

        const response = await apiFetch("/update_address", {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (response.responseCode === 200) {
          await fetchAddressData();
          showAlert(
            "success",
            "Éxito",
            "Dirección principal actualizada correctamente."
          );
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la direccion.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [userId, fetchAddressData]
  );

  const addAddress = useCallback(
    async (newAddress) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch("/create_address", {
          method: "POST",
          body: JSON.stringify(newAddress),
        });

        if (response.responseCode === 200) {
          await fetchAddressData();
          showAlert("success", "Éxito", "Dirección creada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo crear la direccion.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [fetchAddressData]
  );

  const updateAddress = useCallback(
    async (address) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const response = await apiFetch("/update_address", {
          method: "PUT",
          body: JSON.stringify(address),
        });

        if (response.responseCode === 200) {
          await fetchAddressData();
          showAlert("success", "Éxito", "Dirección actualizada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la direccion.");
        console.error(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [fetchAddressData]
  );

  return {
    addressData,
    errors,
    loading,
    handleChange,
    fetchAddressData,
    addAddress,
    updateAddress,
    deleteAddress: confirmDelete,
    setAsPrimary,
  };
};

export default useAddressData;

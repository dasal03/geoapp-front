import { useState, useEffect, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import Validator from "../utils/formValidator";

const useAddressData = (userId, addressId, autoFetch = true) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [addressesData, setAddressesData] = useState([]);
  const { showAlert, showConfirm } = useAlert();

  const fetchAddressData = useCallback(
    async (fetchAll = false) => {
      if (!userId) return;
      setLoading(true);
      try {
        let url = `/get_address?user_id=${userId}`;
        if (!fetchAll && addressId) {
          url += `&address_id=${addressId}`;
        }
        const response = await apiFetch(url);
        if (response.responseCode === 200) {
          const formattedData = response.data.map((address) => ({
            ...address,
          }));
          setAddressesData(formattedData);
          return formattedData;
        } else if (response.responseCode === 404) {
          setAddressesData([]);
          return [];
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudieron cargar las direcciones.");
      } finally {
        setLoading(false);
      }
    },
    [userId, addressId, showAlert]
  );

  useEffect(() => {
    if (autoFetch) fetchAddressData();
  }, [fetchAddressData, autoFetch]);

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
      setAddressesData((prev) =>
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
      setLoading(true);
      try {
        const response = await apiFetch(
          `/delete_address?address_id=${addressId}`,
          { method: "DELETE" }
        );
        if (response.responseCode === 200) {
          setAddressesData((prev) =>
            prev.filter((address) => address.address_id !== addressId)
          );
          showAlert("success", "Eliminado", "Dirección eliminada.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo eliminar la dirección.");
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
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
    [deleteAddress, showConfirm]
  );

  const setAsPrimary = useCallback(
    async (address, newValue) => {
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
          setAddressesData((prev) =>
            prev.map((addrs) => ({
              ...addrs,
              is_principal:
                address.address_id === addrs.address_id
                  ? newValue
                    ? 1
                    : 0
                  : 0,
            }))
          );
          showAlert(
            "success",
            "Éxito",
            "Dirección principal actualizada correctamente."
          );
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la dirección.");
      }
    },
    [userId, showAlert]
  );

  const addAddress = useCallback(
    async (newAddress) => {
      setLoading(true);
      try {
        const response = await apiFetch("/create_address", {
          method: "POST",
          body: JSON.stringify(newAddress),
        });
        if (response.responseCode === 201) {
          showAlert("success", "Éxito", "Dirección creada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo crear la dirección.");
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  const updateAddress = useCallback(
    async (updatedAddress) => {
      const payload = {
        address_id: updatedAddress.address_id,
        user_id: userId,
        ...updatedAddress,
      };
      if (!userId) return;
      setLoading(true);
      try {
        const response = await apiFetch("/update_address", {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (response.responseCode === 200) {
          showAlert("success", "Éxito", "Dirección actualizada correctamente.");
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar la dirección.");
      } finally {
        setLoading(false);
      }
    },
    [userId, showAlert]
  );

  return {
    addressesData,
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

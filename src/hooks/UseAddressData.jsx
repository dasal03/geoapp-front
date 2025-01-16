import { useState, useEffect } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const useAddressData = (userId, onSuccess) => {
  const [addressData, setAddressData] = useState({});
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchAddressData = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/get_address?user_id=${userId}`);
        if (response.responseCode === 200) {
          setAddressData(
            response.data.map((address) => ({
              id: address.address_id,
              ...address,
            }))
          );
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddressData();
  }, [userId]);

  const handleChange = (name, value) => {
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setModifiedFields((prev) => new Set([...prev, name]));

    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const validator = new Validator({ [fieldName]: value });
    const result = validator.validateField(fieldName);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: result.isValid ? undefined : result.message,
    }));
  };

  const updateAddress = async () => {
    try {
      const response = await apiFetch("/update_address", {
        method: "PUT",
        body: JSON.stringify(addressData),
      });
      if (response.responseCode === 200) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo actualizar la dirección.");
    }
  };

  const addAddress = async () => {
    try {
      const response = await apiFetch("/create_address", {
        method: "POST",
        body: JSON.stringify(addressData),
      });
      if (response.responseCode === 201) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo crear la dirección.");
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await apiFetch(`/delete_address?address_id=${id}`, {
        method: "DELETE",
      });
      if (response.responseCode === 200) {
        onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo eliminar la dirección.");
    }
  };

  return {
    addressData,
    modifiedFields,
    errors,
    loading,
    handleChange,
    updateAddress,
    addAddress,
    deleteAddress,
  };
};

export default useAddressData;

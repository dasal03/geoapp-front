import { useState, useEffect } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import { formatDate } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const useProfileData = (userId) => {
  const [profileData, setProfileData] = useState({});
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/get_user?user_id=${userId}`);
        if (response.responseCode === 200) {
          const datesToFormat = ["date_of_birth", "date_of_issue"];
          const formattedData = {
            ...response.data,
            ...Object.fromEntries(
              datesToFormat.map((key) => [key, formatDate(response.data[key])])
            ),
          };
          setProfileData(formattedData);
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, showAlert]);

  const handleChange = (name, value) => {
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setModifiedFields((prev) => {
      const newSet = new Set([...prev, name]);
      return newSet;
    });
    validateField(name, value);
  };

  const handlePhoneChange = (value) => {
    setProfileData((prevData) => ({
      ...prevData,
      phone_number: value,
    }));

    setModifiedFields((prev) => new Set([...prev, "phone_number"]));

    validateField("phone_number", value);
  };

  const validateField = (fieldName, value) => {
    const validator = new Validator({ [fieldName]: value });
    const result = validator.validateField(fieldName);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: result.isValid ? undefined : result.message,
    }));
  };

  const updateProfile = async (updatedDataFromForm) => {
    setLoading(true);

    const updatedData = updatedDataFromForm || {
      user_id: userId,
    };
    updatedData.user_id = userId;

    modifiedFields.forEach((field) => {
      updatedData[field] = profileData[field];
    });

    try {
      const response = await apiFetch("/update_user", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      if (response.responseCode === 200) {
        showAlert(
          "success",
          "Actualizado",
          "Información actualizada con éxito."
        );
        setModifiedFields(new Set());
        setProfileData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      console.error("Error en updateProfile:", error);
      showAlert("error", "Error", "No se pudo actualizar la información.");
    } finally {
      setLoading(false);
    }
  };

  return {
    profileData,
    errors,
    loading,
    handleChange,
    handlePhoneChange,
    updateProfile,
  };
};

export default useProfileData;

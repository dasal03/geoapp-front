import { useState, useEffect } from "react";
import apiFetch from "../utils/apiClient";
import { showAlert, formatDate } from "../utils/generalTools";
import Validator from "../utils/formValidator";

const useProfileData = (onSuccess) => {
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("error", "Error", "No se encuentra el token.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch("/get_user_data_by_token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.responseCode === 200) {
          setUserId(response.data.user_id);
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchTokenData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchProfileData = async () => {
        setLoading(true);
        try {
          const response = await apiFetch(`/get_user?user_id=${userId}`);
          if (response.responseCode === 200) {
            const datesToFormat = ["date_of_birth", "date_of_issue"];
            const formattedData = {
              ...response.data,
              ...Object.fromEntries(
                datesToFormat.map((key) => [
                  key,
                  formatDate(response.data[key]),
                ])
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
    }
  }, [userId]);

  const handleChange = (name, value) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setModifiedFields((prev) => new Set([...prev, name]));

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

  const updateProfile = async () => {
    setLoading(true);

    const updatedData = {
      user_id: userId,
    };
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
        if (onSuccess) onSuccess();
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
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

import { useState, useEffect, useCallback } from "react";
import { useAlert } from "../context/alertProvider";
import apiFetch from "../utils/apiClient";
import { formatDate } from "../utils/generalTools";

const useProfileData = (userId) => {
  const { showAlert } = useAlert();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await apiFetch(`/get_user?user_id=${userId}`);

      if (response.responseCode === 200) {
        const formattedData = {
          ...response.data,
          date_of_birth: formatDate(response.data.date_of_birth),
          created_at: formatDate(response.data.created_at),
        };
        setProfileData(formattedData);
      } else if (response.responseCode === 404) {
        setProfileData({});
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      showAlert("error", "Error", "Error al obtener los datos del perfil");
    } finally {
      setLoading(false);
    }
  }, [userId, showAlert]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const updateProfile = useCallback(
    async (updatedDataFromForm) => {
      if (!userId) return;

      setLoading(true);
      try {
        const updatedData = { ...updatedDataFromForm, user_id: userId };
        const response = await apiFetch("/update_user", {
          method: "PUT",
          body: JSON.stringify(updatedData),
        });

        if (response.responseCode === 200) {
          await fetchProfileData();
          showAlert(
            "success",
            "Actualizado",
            "Datos actualizados correctamente"
          );
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (error) {
        showAlert("error", "Error", "No se pudo actualizar el perfil");
      } finally {
        setLoading(false);
      }
    },
    [userId, showAlert, fetchProfileData]
  );

  return { profileData, updateProfile, loading };
};

export default useProfileData;

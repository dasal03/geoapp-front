import { useState, useEffect } from "react";
import apiFetch from "../utils/apiClient";

const useProfileData = (userId) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError("No se pudo obtener el ID del usuario.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await apiFetch(`/get_user?user_id=${userId}`);

        if (response.responseCode === 200) {
          setProfileData(response.data);
        } else {
          setError(response.description);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return { profileData, loading, error };
};

export default useProfileData;

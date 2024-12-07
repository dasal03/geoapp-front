import React, { useState, useEffect } from "react";
import apiFetch from "../../utils/apiClient";
import { showAlert } from "../../utils/generalTools";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import ProfileHeader from "../../components/profileHeader/ProfileHeader";
import ProfileBody from "../../components/profileBody/ProfileBody";
import "./Profile.scss";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser?.user_id) {
        showAlert("error", "Error", "No se pudo obtener el ID del usuario.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await apiFetch(
          `/get_user?user_id=${authUser.user_id}`
        );

        if (response.responseCode === 200) {
          setProfileData(response.data);
        } else if (response.responseCode === 404) {
          showAlert("error", "Error", response.description);
        } else {
          showAlert("error", "Error", response.description);
        }
      } catch (err) {
        showAlert("error", "Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.user_id]);

  if (loading) return <LoadingSpinner />;

  if (!profileData) {
    showAlert("error", "Error", "No se pudo obtener los datos del perfil.");
    return null;
  }

  return (
    <div className="profile-container">
      <ProfileHeader profileData={profileData} />
      <ProfileBody profileData={profileData} />
    </div>
  );
};

export default Profile;

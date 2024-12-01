import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiFetch from "../../utils/apiClient";
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No hay un usuario logueado.",
        });
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
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontraron datos de perfil.",
          });
        } else {
          throw new Error(
            response.description || "Error desconocido en la API."
          );
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Error desconocido.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.user_id]);

  if (loading) return <LoadingSpinner />;

  if (!profileData) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia",
      text: "No se pudo cargar la información del perfil.",
    });
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

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UseProfileData from "../../hooks/UseProfileData";
import Breadcrumbs from "../../components/breadcrumb/Breadcrumb";
import ProfileBody from "../../components/profileBody/ProfileBody";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import ProfileHeader from "../../components/profileHeader/ProfileHeader";
import "./Profile.scss";

const Profile = () => {
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { profileData, errors, loading, handleChange } = UseProfileData(
    authUser?.user_id,
    () => setIsEditing(false)
  );

  const breadcrumbItems = [
    { path: "/profile", label: "Perfil" },
    { path: "/profile/personal-info", label: "Información Personal" },
    { path: "/profile/account-info", label: "Datos de tu Cuenta" },
    { path: "/profile/security", label: "Seguridad" },
    {
      path: "/profile/security/enable-2fa",
      label: "Activar Verificación en dos pasos",
    },
    { path: "/profile/security/change-password", label: "Cambiar Contraseña" },
    { path: "/profile/cards", label: "Tarjetas" },
    { path: "/profile/addresses", label: "Direcciones" },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-container">
      <ProfileHeader
        profileData={profileData}
        isEditing={isEditing}
        handleChange={handleChange}
        errors={errors}
        setIsEditing={setIsEditing}
      />
      {location.pathname !== "/profile" && (
        <Breadcrumbs breadcrumbItems={breadcrumbItems} />
      )}

      {location.pathname === "/profile" && (
        <ProfileBody profileData={profileData} />
      )}

      <Outlet context={{ profileData }} />
    </div>
  );
};

export default Profile;

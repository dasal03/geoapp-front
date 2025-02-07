import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UseProfileData from "../../hooks/UseProfileData";
import Breadcrumbs from "../../components/breadcrumb/Breadcrumb";
import ProfileBody from "../../components/profileBody/ProfileBody";
import ProfileHeader from "../../components/profileHeader/ProfileHeader";
import Loader from "../../components/ui/loader/Loader";
import "./Profile.scss";

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

const Profile = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  console.log("user", user?.user_id);

  const { profileData, errors, handleChange, loading } = UseProfileData(
    user?.user_id,
    () => setIsEditing(false)
  );

  if (isLoading || loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

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

      {location.pathname === "/profile/security" && (
        <div className="security-settings">
          <h3>Configuración de Seguridad</h3>
        </div>
      )}

      {location.pathname === "/profile/security/enable-2fa" && (
        <div className="enable-2fa">
          <h3>Activar Verificación en dos pasos</h3>
        </div>
      )}

      {errors &&
        Object.values(errors).map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}

      <Outlet context={{ profileData }} />
    </div>
  );
};

export default Profile;

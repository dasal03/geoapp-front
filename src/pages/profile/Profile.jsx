import { useState, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  useMatch,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UseProfileData from "../../hooks/UseProfileData";
import Breadcrumbs from "../../components/breadcrumb/Breadcrumb";
import ProfileBody from "../../components/profileBody/ProfileBody";
import ProfileHeader from "../../components/profileHeader/ProfileHeader";
import Loader from "../../components/ui/loader/Loader";
import "./Profile.scss";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { profileData, errors, handleChange, loading, updateProfile } =
    UseProfileData(user?.user_id, () => setIsEditing(false));

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(location.search);
      if (params.get("user_id") !== String(user.user_id)) {
        params.set("user_id", user.user_id);
        navigate(`${location.pathname}?${params.toString()}`, {
          replace: true,
        });
      }
    }
  }, [user, location.pathname, location.search, navigate]);

  const isProfileIndex = useMatch({ path: "/profile", end: true });
  const isSecurity = useMatch({ path: "/profile/security", end: true });

  if (isLoading || loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  const breadcrumbItems = [
    { path: "/profile", label: "Perfil" },
    { path: "/profile/personal-info", label: "Información Personal" },
    { path: "/profile/account-info", label: "Datos de tu Cuenta" },
    { path: "/profile/security", label: "Seguridad" },
    { path: "/profile/security/change-password", label: "Cambiar Contraseña" },
    { path: "/profile/payment-cards", label: "Tarjetas" },
    { path: "/profile/payment-cards-form", label: "Modificar Tarjetas" },
    { path: "/profile/addresses", label: "Direcciones" },
    { path: "/profile/addresses-form", label: "Modificar Direcciones" },
  ];

  return (
    <div className="profile-container">
      <ProfileHeader
        profileData={profileData}
        isEditing={isEditing}
        handleChange={handleChange}
        errors={errors}
        setIsEditing={setIsEditing}
      />

      {!isProfileIndex && <Breadcrumbs breadcrumbItems={breadcrumbItems} />}
      {isProfileIndex && <ProfileBody profileData={profileData} />}

      {isSecurity && (
        <div className="security-settings">
          <h3>Configuración de Seguridad</h3>
        </div>
      )}

      {errors &&
        Object.values(errors).map((error, index) => (
          <div key={index} className="error-message">
            {error}
          </div>
        ))}

      <Outlet context={{ profileData, updateProfile }} />
    </div>
  );
};

export default Profile;

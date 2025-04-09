import { useEffect } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  useMatch,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfileData } from "../../hooks";
import { Breadcrumbs, ProfileBody, ProfileHeader } from "../../components";
import "./Profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { profileData, updateProfile, loading } = useProfileData(user?.user_id);
  const isProfileIndex = useMatch({ path: "/profile", end: true });

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    if (params.get("user_id") !== String(user.user_id)) {
      params.set("user_id", user.user_id);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [user, location, navigate]);

  if (!user) return <Navigate to="/login" replace />;

  const params = new URLSearchParams(location.search);
  const isEditingPayment = params.has("payment_card_id");
  const isEditingAddress = params.has("address_id");

  const breadcrumbItems = [
    { path: "/profile", label: "Perfil" },
    { path: "/profile/personal-info", label: "Información Personal" },
    { path: "/profile/account-info", label: "Datos de tu Cuenta" },
    { path: "/profile/security", label: "Seguridad" },
    { path: "/profile/security/change-password", label: "Cambiar Contraseña" },
    { path: "/profile/payment-cards", label: "Tarjetas" },
    {
      path: "/profile/payment-cards-form",
      label: isEditingPayment ? "Editar Tarjeta" : "Crear Tarjeta",
    },
    { path: "/profile/addresses", label: "Domicilios" },
    {
      path: "/profile/addresses-form",
      label: isEditingAddress ? "Editar Dirección" : "Crear Dirección",
    },
  ];

  return (
    <div className="profile-container">
      <ProfileHeader
        profileData={profileData}
        handleSave={updateProfile}
        loading={loading}
      />

      {!isProfileIndex && <Breadcrumbs breadcrumbItems={breadcrumbItems} />}
      {isProfileIndex && <ProfileBody loading={loading} />}
      {!isProfileIndex && <Outlet />}
    </div>
  );
};

export default Profile;

import {
  FaIdCard,
  FaUser,
  FaLock,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Outlet } from "react-router-dom";
import SectionCards from "../sectionCards/SectionCards";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const cards = [
    {
      path: "/profile/personal-info",
      icon: <FaIdCard className="profile-icon" />,
      title: "Información Personal",
      description:
        "Gestiona tus datos personales como nombre, teléfono y fecha de nacimiento.",
    },
    {
      path: "/profile/account-info",
      icon: <FaUser className="profile-icon" />,
      title: "Datos de tu Cuenta",
      description:
        "Accede y edita tus datos de cuenta, como correo electrónico y contraseña.",
    },
    {
      path: "/profile/security",
      icon: <FaLock className="profile-icon" />,
      title: "Seguridad",
      description:
        "Asegura tu cuenta con configuraciones de seguridad adicionales.",
    },
    {
      path: "/profile/cards",
      icon: <FaCreditCard className="profile-icon" />,
      title: "Tarjetas",
      description: "Agrega, edita o elimina tus tarjetas de pago.",
    },
    {
      path: "/profile/addresses",
      icon: <FaMapMarkerAlt className="profile-icon" />,
      title: "Direcciones",
      description: "Gestiona tus direcciones de envío y facturación.",
    },
  ];

  return (
    <>
      <SectionCards cards={cards} />
      <Outlet context={{ profileData }} />
    </>
  );
};

export default ProfileBody;

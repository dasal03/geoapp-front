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
      description: "Información personal y de identidad.",
    },
    {
      path: "/profile/account-info",
      icon: <FaUser className="profile-icon" />,
      title: "Datos de tu Cuenta",
      description: "Datos que representan a tu cuenta.",
    },
    {
      path: "/profile/security",
      icon: <FaLock className="profile-icon" />,
      title: "Seguridad",
      description:
        "configuraciones de seguridad.",
    },
    {
      path: "/profile/payment-cards",
      icon: <FaCreditCard className="profile-icon" />,
      title: "Tarjetas",
      description: "Tarjetas guardadas en tu cuenta.",
    },
    {
      path: "/profile/addresses",
      icon: <FaMapMarkerAlt className="profile-icon" />,
      title: "Direcciones",
      description: "Direcciones guardadas en tu cuenta.",
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

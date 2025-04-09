import SectionCards from "../sectionCards/SectionCards";
import {
  FaIdCard,
  FaUser,
  FaLock,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./ProfileBody.scss";

const ProfileBody = () => {
  const cards = [
    {
      path: "/profile/personal-info",
      icon: <FaIdCard />,
      title: "Información Personal",
      description: "Información personal y de identidad.",
    },
    {
      path: "/profile/account-info",
      icon: <FaUser />,
      title: "Datos de tu Cuenta",
      description: "Datos que representan a tu cuenta.",
    },
    {
      path: "/profile/security",
      icon: <FaLock />,
      title: "Seguridad",
      description: "Configuraciones de seguridad.",
    },
    {
      path: "/profile/payment-cards",
      icon: <FaCreditCard />,
      title: "Tarjetas",
      description: "Tarjetas guardadas en tu cuenta.",
    },
    {
      path: "/profile/addresses",
      icon: <FaMapMarkerAlt />,
      title: "Direcciones",
      description: "Direcciones guardadas en tu cuenta.",
    },
  ];

  return <SectionCards cards={cards} />;
};

export default ProfileBody;

import { FaKey, FaMobileAlt } from "react-icons/fa";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Loader from "../../../components/ui/loader/Loader";
import SectionCards from "../../../components/sectionCards/SectionCards";

const Security = () => {
  const { profileData } = useOutletContext();
  const location = useLocation();

  if (!profileData) {
    return <Loader />;
  }

  const cards = [
    {
      path: "/profile/security/change-password",
      icon: <FaKey className="profile-icon" />,
      title: "Cambiar Contraseña",
      description: "Actualiza tu contraseña de acceso a tu cuenta.",
    },
    {
      path: "/profile/security/enable-2fa",
      icon: <FaMobileAlt className="profile-icon" />,
      title: "Activar Verificación en dos pasos",
      description: "Activa la verificación en dos pasos para tu cuenta.",
    },
  ];

  if (location.pathname !== "/profile/security") {
    return <Outlet context={{ profileData }} />;
  }

  return (
    <>
      <SectionCards cards={cards} />
      <Outlet context={{ profileData }} />
    </>
  );
};

export default Security;

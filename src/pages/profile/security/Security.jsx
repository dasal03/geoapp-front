import { Outlet, useLocation } from "react-router-dom";
import { SectionCards } from "../../../components";
import { FaKey } from "react-icons/fa";

const Security = () => {
  const location = useLocation();
  const isSecurityIndex = location.pathname === "/profile/security";

  const cards = [
    {
      path: "/profile/security/change-password",
      icon: <FaKey className="profile-icon" />,
      title: "Cambiar Contraseña",
      description: "Actualiza tu contraseña de acceso a tu cuenta.",
    },
  ];

  return (
    <>
      {isSecurityIndex && <SectionCards cards={cards} />}
      <Outlet />
    </>
  );
};

export default Security;

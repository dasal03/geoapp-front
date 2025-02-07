import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import "./Unauthorized.scss";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-hero">
        <div className="unauthorized-icon">
          <FaLock />
        </div>
        <h1>403</h1>
        <div className="h1-decorator"></div>
        <p className="unauthorized-message">Acceso denegado</p>
        <button onClick={() => navigate("/")}>Volver al Inicio</button>
      </div>
      <div className="unauthorized-content">
        <p>
          No tienes permisos para acceder a esta página. Si crees que esto es un
          error, contacta al administrador.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;

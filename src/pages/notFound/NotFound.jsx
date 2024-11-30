import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./NotFound.scss";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-hero">
        <div className="notfound-icon">
          <FaExclamationTriangle />
        </div>
        <h1>404</h1>
        <div className="h1-decorator"></div>
        <p className="notfound-message">¡Oops! La página no fue encontrada.</p>
        <button onClick={() => navigate("/")}>Volver al Inicio</button>
      </div>
      <div className="notfound-content">
        <p>
          La página que buscas podría haber sido eliminada, cambiada de nombre o
          no estar disponible temporalmente. Por favor, verifica el enlace o
          regresa a nuestra página principal.
        </p>
      </div>
    </div>
  );
}

export default NotFound;

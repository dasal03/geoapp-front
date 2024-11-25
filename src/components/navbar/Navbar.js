import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GeoApp
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Inicio
            </Link>
          </li>
          {token ? (
            <>
              <li className="nav-item">
                <Link to="/equipment_management" className="nav-links">
                  Gestionar Equipos
                </Link>
                <li className="nav-item">
                  <Link to="/maintenance" className="nav-links">
                    Mantenimientos
                  </Link>
                </li>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-links">
                  Mi Perfil
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="logout-button">
                  <FaSignOutAlt />
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

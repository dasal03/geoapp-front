import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import "./Navbar.scss";

function Navbar() {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const servicesItems = [
    { label: "Gestiones", path: "/services/management" },
    { label: "Mantenimientos", path: "/services/maintenance" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GeoApp
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <FaHome /> Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">
              <FaInfoCircle /> Acerca de
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/contact" className="nav-links">
              <FaEnvelope /> Contactanos
            </Link>
          </li>
          {token ? (
            <>
              <li className="nav-item">
                <Dropdown title="Servicios" items={servicesItems} />
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-links">
                  <FaUserCircle /> Mi perfil
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="logout-button">
                  Cerrar sesión <FaSignOutAlt className="logout-icon" />
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links">
                <FaUserCircle /> Iniciar sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

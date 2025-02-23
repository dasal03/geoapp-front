import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaBell,
  FaSignInAlt,
} from "react-icons/fa";
import "./Navbar.scss";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setOpenDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => (e) => {
    e.preventDefault();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          GeoApp
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={closeMenu}>
              Acerca de
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact-us" className="nav-links" onClick={closeMenu}>
              Contáctanos
            </Link>
          </li>
          <li
            className={`nav-item services-dropdown ${
              openDropdown === "services" ? "active" : ""
            }`}
          >
            <Link className="nav-links" onClick={toggleDropdown("services")}>
              Servicios
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link
                  to="/services/management"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  Gestiones
                </Link>
              </li>
              <li>
                <Link
                  to="/services/maintenance"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  Mantenimientos
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <div className="navbar-right">
          <Link to="/cart" className="icon-link" onClick={closeMenu}>
            <FaShoppingCart />
          </Link>
          {token && (
            // TODO
            <div
              className={`dropdown ${
                openDropdown === "notifications" ? "active" : ""
              }`}
            >
              <Link
                className="icon-link"
                onClick={toggleDropdown("notifications")}
              >
                <FaBell />
                <span className="badge">1</span>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="#" className="dropdown-item">
                    Some news
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Another news
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Something else here
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {token ? (
            <div className="user-menu">
              <div
                className={`dropdown ${
                  openDropdown === "user" ? "active" : ""
                }`}
              >
                <button
                  className="dropdown-toggle"
                  onClick={toggleDropdown("user")}
                >
                  <img
                    src={
                      user?.profile_img
                        ? user.profile_img
                        : placeholderProfileImage
                    }
                    className="avatar"
                    alt="User Avatar"
                  />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout} className="dropdown-item">
                      Salir
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-link" onClick={closeMenu}>
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

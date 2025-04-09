import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../notificationsDropdown/NotificationsDropdown";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import { FaBars, FaTimes, FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import "./Navbar.scss";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const notifications = [
    { message: "Tienes una nueva solicitud de soporte." },
    { message: "Tu contraseña fue actualizada con éxito." },
  ];

  const cartCount = 3; // TODO: Reemplazar por el valor dinámico real del carrito
  const userId = user?.user_id || "";

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

  useEffect(() => {
    setOpenDropdown(null);
  }, [token]);

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
          {token && (
            <Link to="/cart" className="icon-link" onClick={closeMenu}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
          )}
          {token && (
            <NotificationsDropdown
              notifications={notifications}
              isActive={openDropdown === "notifications"}
              toggleDropdown={toggleDropdown("notifications")}
              closeMenu={closeMenu}
              userId={userId}
            />
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

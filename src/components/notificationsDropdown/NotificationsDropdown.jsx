import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import "./NotificationsDropdown.scss";

const NotificationsDropdown = ({ notifications = [] }) => {
  const [isActive, setIsActive] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const dropdownRef = useRef(null);

  const hasNotifications = notifications.length > 0;

  const handleMouseEnter = () => {
    if (!isFixed) setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (!isFixed) setIsActive(false);
  };

  const toggleFixed = () => {
    setIsFixed(!isFixed);
    setIsActive(!isFixed);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isFixed &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsFixed(false);
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFixed]);

  return (
    <div
      className={`notifications-dropdown ${isActive ? "active" : ""}`}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dropdown-toggle" onClick={toggleFixed}>
        <div className="icon-link">
          <FaBell />
          {notifications.length > 0 && (
            <span className="badge">{notifications.length}</span>
          )}
        </div>
      </div>

      {isActive && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <span className="dropdown-title">Notificaciones</span>
            <Link to="/notification-settings" className="settings-link">
              <FiSettings className="settings-icon" />
            </Link>
          </div>

          <div className="dropdown-content">
            {hasNotifications ? (
              notifications.map((notif, index) => (
                <Link
                  to={notif.link || "#"}
                  key={index}
                  className="notification-card"
                  onClick={() => {
                    setIsFixed(false);
                    setIsActive(false);
                  }}
                >
                  {notif.message}
                </Link>
              ))
            ) : (
              <div className="no-notifications">
                Por ahora, no hay nada aquí.
              </div>
            )}
          </div>

          <div className="dropdown-footer">
            <Link
              to="/notifications"
              onClick={() => {
                setIsFixed(false);
                setIsActive(false);
              }}
            >
              Mostrar todo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;

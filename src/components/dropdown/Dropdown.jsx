import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Dropdown.scss";

function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`dropdown ${isOpen ? "open" : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {title}{" "}
        <span className="dropdown-arrow">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleRedirect(item.path)}
            >
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;

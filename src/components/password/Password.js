import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Password.css";

export const Password = ({ label, name, placeholder, value, onChange }) => {
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const [type, setType] = useState("password");
  const handleToggle = () => {
    if (type === "password") {
      setIcon(<FaEye />);
      setType("text");
    } else {
      setIcon(<FaEyeSlash />);
      setType("password");
    }
  };

  return (
    <div className="password-container">
      <div className="password-input">
        <label htmlFor="password">{label}</label>
        <input
          type={type}
          id="password"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      </div>
      <span className="icon-container" onClick={handleToggle}>
        {icon}
      </span>
    </div>
  );
};

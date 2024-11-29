import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordField.scss";

const PasswordField = ({ label, id, name, placeholder, value, onChange }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input-container">
        <input
          type={isPasswordVisible ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <span className="toggle-icon" onClick={toggleVisibility}>
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    </div>
  );
};

export default PasswordField;

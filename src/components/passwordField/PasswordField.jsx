import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordField.scss";

const PasswordField = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  styleType = "default",
  disabled = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="password-field">
      <label>{label}</label>
      <div className="password-input-container">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`password-input ${styleType}`}
          disabled={disabled}
        />
        <span className="toggle-icon" onClick={toggleVisibility}>
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    </div>
  );
};

export default PasswordField;

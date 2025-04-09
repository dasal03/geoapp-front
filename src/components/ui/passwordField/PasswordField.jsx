import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./PasswordField.scss";

const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  maxLength,
  required = false,
  disabled = false,
  styleType = "default",
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
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={styleType}
        />
        <span className="toggle-icon" onClick={toggleVisibility}>
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    </div>
  );
};

export default PasswordField;

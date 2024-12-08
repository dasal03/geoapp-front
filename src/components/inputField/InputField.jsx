import React from "react";
import "./InputField.scss";

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  styleType = "default",
  disabled = false
}) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${styleType}`}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;

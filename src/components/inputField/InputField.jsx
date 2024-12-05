import React from "react";
import "./InputField.scss";

const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
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
      />
    </div>
  );
};

export default InputField;

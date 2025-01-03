import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneField.scss";

const PhoneField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  styleType = "default",
}) => {
  const [phone, setPhone] = useState(value);

  const handleChange = (value) => {
    setPhone(value);
    onChange(value);
  };

  return (
    <div className="phone-field">
      <label htmlFor={label}>{label}</label>
      <PhoneInput
        international
        defaultCountry="CO"
        name={name}
        value={phone}
        placeholder={placeholder}
        onChange={handleChange}
        required={required}
        className={`phone ${styleType}`}
      />
    </div>
  );
};

export default PhoneField;

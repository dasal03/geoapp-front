import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneField.scss";

const PhoneField = ({ label, value, onChange }) => {
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
        value={phone}
        onChange={handleChange}
        placeholder="Número de teléfono"
      />
    </div>
  );
};

export default PhoneField;

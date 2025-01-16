import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneField.scss";

const PhoneField = ({
  label,
  name,
  value = "",
  handlePhoneChange,
  placeholder,
  required = false,
  disabled = false,
  styleType = "default",
}) => {
  const [phone, setPhone] = useState(isValidPhoneNumber(value) ? value : "");

  const handleChange = (value) => {
    setPhone(value);
    handlePhoneChange(value);
  };

  return (
    <div className="phone-field">
      <label>{label}</label>
      <PhoneInput
        international
        defaultCountry="CO"
        name={name}
        value={phone}
        placeholder={placeholder}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={styleType}
      />
    </div>
  );
};

export default PhoneField;

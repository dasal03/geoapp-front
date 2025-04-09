import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneField.scss";

const PhoneField = ({
  label,
  name,
  value = "",
  onChange: handlePhoneChange,
  placeholder,
  required = false,
  disabled = false,
  styleType = "default",
}) => {
  const [phone, setPhone] = useState(isValidPhoneNumber(value) ? value : "");

  useEffect(() => {
    setPhone(value || "");
  }, [value]);

  const handleChange = (newValue) => {
    if (!newValue || !isValidPhoneNumber(newValue)) {
      setPhone("");
      handlePhoneChange("");
      return;
    }

    setPhone(newValue || "");
    handlePhoneChange(newValue || "");
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

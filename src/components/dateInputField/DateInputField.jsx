import React from "react";
import "./DateInputField.scss";

const DateInput = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  styleType = "default",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="date-input">
      <label htmlFor={label}>{label}</label>
      <input
        type="date"
        value={value || ""}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={`date-input ${styleType}`}
      />
    </div>
  );
};

export default DateInput;

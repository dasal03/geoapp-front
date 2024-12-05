import React from "react";
import "./DateInput.scss";

const DateInput = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="date-input">
      <label htmlFor={label}>{label}</label>
      <input type="date" value={value || ""} onChange={handleChange} required />
    </div>
  );
};

export default DateInput;

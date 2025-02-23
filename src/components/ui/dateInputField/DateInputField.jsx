import "./DateInputField.scss";

const DateInputField = ({
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
      <label>{label}</label>
      <input
        type="date"
        value={value || ""}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={styleType}
      />
    </div>
  );
};

export default DateInputField;

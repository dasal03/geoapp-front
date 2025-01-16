import "./InputField.scss";

const InputField = ({
  label,
  type,
  name,
  placeholder,
  value,
  checked,
  onChange,
  required = false,
  disabled = false,
  styleType = "default",
}) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        {...(type === "checkbox" ? { checked } : { value })}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={styleType}
      />
    </div>
  );
};

export default InputField;

import "./SelectField.scss";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled,
  styleType = "default",
}) => {
  const normalizedOptions = Array.isArray(options)
    ? options
    : [{ value: options, label: options }];

  return (
    <div className="select-field">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        className={styleType}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder || "Seleccione una opción"}
        </option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;

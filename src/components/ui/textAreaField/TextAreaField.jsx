import "./TextAreaField.scss";

const TextAreaField = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="textarea-field">
      <label>{label}</label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default TextAreaField;

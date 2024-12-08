import React from "react";
import PropTypes from "prop-types";
import "./SelectField.scss";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => {
  const normalizedOptions = Array.isArray(options)
    ? options
    : [{ value: options, label: options }];

  return (
    <div className="select-field">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectField.defaultProps = {
  label: "",
  placeholder: "",
  disabled: false,
};

export default SelectField;

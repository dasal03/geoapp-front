import { forwardRef } from "react";
import "./InputField.scss";

const InputField = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      value,
      checked,
      onChange,
      onFocus,
      maxLength,
      autoComplete,
      required = false,
      disabled = false,
      styleType = "default",
    },
    ref
  ) => {
    return (
      <div className="input-field">
        <label>{label}</label>
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          {...(type === "checkbox" ? { checked } : { defaultValue: value })}
          onChange={onChange}
          onFocus={onFocus}
          maxLength={maxLength}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={styleType}
        />
      </div>
    );
  }
);

export default InputField;

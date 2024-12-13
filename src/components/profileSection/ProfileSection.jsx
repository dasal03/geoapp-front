import React from "react";
import InputField from "../inputField/InputField";
import PhoneField from "../phoneField/PhoneField";
import DateInputField from "../dateInputField/DateInputField";
import SelectField from "../selectField/SelectField";

const ProfileSection = ({
  title,
  fields,
  isEditing,
  handleInputChange,
  handlePhoneChange,
}) => {
  const renderField = (field) => {
    const value = field.value || "";
    if (!isEditing) {
      return (
        <>
          <strong>{field.label}:</strong>
          <p>{value}</p>
        </>
      );
    }

    switch (field.type) {
      case "text":
      case "email":
        return (
          <InputField
            label={field.label}
            value={value}
            name={field.name}
            required={field.required}
            disabled={field.disabled}
            onChange={handleInputChange}
          />
        );
      case "phone":
        return (
          <PhoneField
            label={field.label}
            value={value}
            name={field.name}
            onChange={handlePhoneChange}
          />
        );
      case "date":
        return (
          <DateInputField
            label={field.label}
            value={value}
            name={field.name}
            disabled={field.disabled}
            onChange={handleInputChange}
          />
        );
      case "select":
        return (
          <SelectField
            label={field.label}
            value={value}
            name={field.name}
            disabled={field.disabled}
            options={field.options}
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-section">
      <h2>{title}</h2>
      {fields.map((field, idx) => (
        <div key={idx} className="profile-field">
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default ProfileSection;

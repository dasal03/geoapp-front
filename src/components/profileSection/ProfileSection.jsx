import React from "react";
import InputField from "../inputField/InputField";
import PhoneField from "../phoneField/PhoneField";
import DateInputField from "../dateInputField/DateInputField";
import SelectField from "../selectField/SelectField";

const ProfileSection = ({ title, fields, isEditing, handleChange }) => {
  const renderField = (field) => {
    if (!isEditing) {
      return (
        <>
          <strong>{field.label}:</strong>
          <p>{field.value}</p>
        </>
      );
    }

    switch (field.type) {
      case "text":
      case "email":
    //   case "password":
        return (
          <InputField
            label={field.label}
            type={field.type}
            value={field.value}
            name={field.name}
            onChange={handleChange}
          />
        );
      case "phone":
        return (
          <PhoneField
            label={field.label}
            value={field.value}
            name={field.name}
            onChange={handleChange}
          />
        );
      case "date":
        return (
          <DateInputField
            label={field.label}
            value={field.value}
            name={field.name}
            onChange={handleChange}
          />
        );
      case "select":
        return (
          <SelectField
            label={field.label}
            options={field.options || []}
            value={field.value}
            name={field.name}
            onChange={handleChange}
          />
        );
      default:
        return <p>{field.value}</p>;
    }
  };

  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <div key={index}>{renderField(field)}</div>
      ))}
    </section>
  );
};

export default ProfileSection;

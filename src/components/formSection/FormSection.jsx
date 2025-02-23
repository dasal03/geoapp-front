import { useState } from "react";
import InputField from "../ui/inputField/InputField";
import PasswordField from "../ui/passwordField/PasswordField";
import SelectField from "../ui/selectField/SelectField";
import PhoneField from "../ui/phoneField/PhoneField";
import DateInputField from "../ui/dateInputField/DateInputField";
import SectionActions from "../sectionActions/SectionActions";
import "./FormSection.scss";

const FormSection = ({ section, initialData = {}, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(initialData);
  const [changedFields, setChangedFields] = useState({});

  const userId = initialData.user_id;

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setFormValues(initialData);
    setChangedFields({});
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
    setChangedFields((prevChanges) => ({
      ...prevChanges,
      [fieldName]: true,
    }));
  };

  const handleSaveClick = () => {
    const modifiedFields = Object.keys(changedFields)
      .filter((field) => changedFields[field])
      .reduce((obj, field) => {
        obj[field] = formValues[field];
        return obj;
      }, {});

    const finalData = { ...modifiedFields, user_id: userId };

    if (onSave) onSave(finalData);
    setChangedFields({});
    setIsEditing(false);
  };

  const renderField = (field) => {
    const isDisabled = field.disabled || !isEditing;

    const commonProps = {
      label: field.label,
      value: formValues[field.name] || "",
      placeholder: field.placeholder,
      name: field.name,
      onChange: (e) => handleInputChange(field.name, e.target.value),
      disabled: isDisabled,
    };

    switch (field.type) {
      case "text":
      case "email":
        return <InputField {...commonProps} />;
      case "password":
        return <PasswordField {...commonProps} />;
      case "phone":
        return (
          <PhoneField
            {...commonProps}
            handlePhoneChange={(value) => handleInputChange(field.name, value)}
          />
        );
      case "date":
        return <DateInputField {...commonProps} />;
      case "select":
        return <SelectField {...commonProps} options={field.options} />;
      default:
        return null;
    }
  };

  return (
    <section
      className={`form-section ${
        section.fields.length > 0 ? "has-items" : "empty"
      }`}
    >
      <h3 className="form-section-title">{section.title}</h3>

      {section.fields.length > 0 ? (
        <>
          <div className="form-section-fields">
            {section.fields.map((field, index) => (
              <div key={index} className="form-field">
                {renderField(field)}
              </div>
            ))}
          </div>
          <SectionActions
            isEditing={isEditing}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
            onEdit={handleEditClick}
          />
        </>
      ) : (
        <p className="no-data">No hay datos para mostrar en el momento.</p>
      )}
    </section>
  );
};

export default FormSection;

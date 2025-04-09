import { useState, useEffect } from "react";
import Validator from "../../utils/formValidator";
import SectionActions from "../sectionActions/SectionActions";
import {
  PhoneField,
  InputField,
  SelectField,
  PasswordField,
  DateInputField,
} from "../ui";
import "./FormSection.scss";

const mapInitialData = (dataArray) => {
  if (!Array.isArray(dataArray)) return dataArray;
  return dataArray.reduce((acc, { name, value }) => {
    acc[name] = value ?? "";
    return acc;
  }, {});
};

const FormSection = ({ section, initialData = {}, onSave, loading }) => {
  const mappedData = mapInitialData(initialData || {});
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(mappedData);
  const [formError, setFormError] = useState({});
  const [changedFields, setChangedFields] = useState({});

  const userId = mappedData.user_id;

  useEffect(() => {
    setFormValues(mapInitialData(initialData));
    setFormError({});
  }, [initialData]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setFormValues(mapInitialData(initialData));
    setChangedFields({});
    setFormError({});
    setIsEditing(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value ?? "",
    }));
    setChangedFields((prevChanges) => ({
      ...prevChanges,
      [fieldName]: true,
    }));

    const validator = new Validator({ [fieldName]: value ?? "" });
    const validation = validator.validateField({ name: fieldName });

    if (!validation.isValid) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validation.message,
      }));
    } else {
      setFormError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSaveClick = () => {
    const modifiedFields = Object.keys(changedFields).reduce((acc, field) => {
      acc[field] = formValues[field];
      return acc;
    }, {});

    if (Object.keys(modifiedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    const finalData = {
      ...modifiedFields,
      user_id: userId || initialData?.user_id,
    };

    if (!finalData.user_id) {
      console.error("Error: user_id no está definido en finalData", finalData);
      return;
    }

    let errors = {};
    section.fields.forEach((field) => {
      if (field.required && modifiedFields[field.name] !== undefined) {
        const validator = new Validator({
          [field.name]: finalData[field.name],
        });
        const validation = validator.validateField(field);

        if (!validation.isValid) {
          errors[field.name] = validation.message;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    if (onSave) onSave(finalData);
    setChangedFields({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <section className="form-section skeleton">
        <h3 className="form-section-title skeleton-title">
          <span className="visually-hidden">Cargando sección</span>
        </h3>
        <div className="form-section-fields">
          {section.fields.map((field, index) => (
            <div key={index} className="form-field skeleton-field">
              <div className="skeleton-label"></div>
              <div className="skeleton-input"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const renderField = (field) => {
    const value = formValues[field.name] || "";
    const errorMessage = formError?.[field.name];
    const hasError = Boolean(errorMessage);

    const commonProps = {
      label: field.label,
      value,
      name: field.name,
      placeholder: field.placeholder,
      className: `form-${field.type}${hasError ? ` ${field.type}-error` : ""}`,
      disabled: field.disabled || !isEditing,
      onChange: (value) => handleInputChange(field.name, value),
    };

    const fieldComponents = {
      text: InputField,
      email: InputField,
      password: PasswordField,
      select: SelectField,
      date: DateInputField,
      phone: PhoneField,
    };

    const Component = fieldComponents[field.type];
    if (!Component) return null;

    const extraProps = {};
    if (field.type === "select") {
      extraProps.options = field.options;
    }

    return (
      <div
        key={field.name}
        className={`field-wrapper ${hasError ? "error" : ""}`}
      >
        <Component {...commonProps} {...extraProps} />
        {hasError && <span className="error-message">{errorMessage}</span>}
      </div>
    );
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

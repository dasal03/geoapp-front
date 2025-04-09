import { InputField, TextAreaField, Button, Loader } from "../ui";
import "./ContactForm.scss";

const ContactForm = ({
  fields,
  formValues,
  formError,
  handleSubmit,
  handleChange,
  loading,
}) => {
  const renderField = (field) => {
    const value = formValues[field.name] || "";
    const errorMessage = formError[field.name];
    const hasError = Boolean(errorMessage);

    const commonProps = {
      label: field.label,
      value,
      placeholder: field.placeholder,
      styleType: `form-${field.type}${hasError ? ` ${field.type}-error` : ""}`,
      disabled: field.disabled || false,
      "aria-invalid": hasError,
      onChange: (e) => handleChange(field.name, e),
    };

    const fieldComponents = {
      text: InputField,
      email: InputField,
      textarea: TextAreaField,
    };

    const Component = fieldComponents[field.type] || InputField;

    return (
      <div
        key={field.name}
        className={`field-wrapper ${hasError ? "error" : ""}`}
      >
        <Component {...commonProps} />
        {hasError && <span className="error-message">{errorMessage}</span>}
      </div>
    );
  };

  return (
    <div className="contact-form-container">
      {loading ? (
        <Loader />
      ) : (
        <div className="contact-form">
          <header>
            <h2 className="form-header">Envíanos tu mensaje</h2>
          </header>
          <form onSubmit={handleSubmit} noValidate>
            <div className="fields">{fields.map(renderField)}</div>
            <div className="buttons">
              <Button
                type="submit"
                text="Enviar mensaje"
                icon="fas fa-arrow-right"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactForm;

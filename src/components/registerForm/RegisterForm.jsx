import { Link } from "react-router-dom";
import useRegister from "../../hooks/UseRegister";
import Button from "../ui/button/Button";
import InputField from "../ui/inputField/InputField";
import PasswordField from "../ui/passwordField/PasswordField";
import SelectField from "../ui/selectField/SelectField";
import PhoneField from "../ui/phoneField/PhoneField";
import DateInputField from "../ui/dateInputField/DateInputField";
import Loader from "../ui/loader/Loader";

const RegisterForm = () => {
  const {
    isLoading,
    activeForm,
    formValues,
    formError,
    formFieldsSections,
    handleSubmit,
    handleChange,
    handlePhoneChange,
    handleFormSwitch,
  } = useRegister();

  const renderField = (field) => {
    const value = formValues[field.name] || "";
    const hasError = formError.field === field.name;

    const commonProps = {
      label: field.label,
      value,
      placeholder: field.placeholder,
      styleType: `form-${field.type}${hasError ? ` ${field.type}-error` : ""}`,
      disabled: field.disabled || false,
      onChange: (e) => handleChange(field.name, e),
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
    if (field.type === "phone") {
      extraProps.handlePhoneChange = handlePhoneChange;
    }

    return (
      <div className={`field-wrapper ${hasError ? "error" : ""}`}>
        <Component {...commonProps} {...extraProps} />
        {hasError && <span className="error-message">{formError.message}</span>}
      </div>
    );
  };

  const buttonConfigs = {
    first: [
      {
        type: "button",
        text: "Siguiente",
        icon: "fas fa-arrow-right",
        onClick: () => handleFormSwitch("next"),
        styleType: "next-btn",
      },
    ],
    second: [
      {
        type: "button",
        text: "Volver",
        icon: "fas fa-arrow-left",
        onClick: () => handleFormSwitch("back"),
        styleType: "back-btn",
      },
      {
        type: "button",
        text: "Siguiente",
        icon: "fas fa-arrow-right",
        onClick: () => handleFormSwitch("next"),
        styleType: "next-btn",
      },
    ],
    third: [
      {
        type: "button",
        text: "Volver",
        icon: "fas fa-arrow-left",
        onClick: () => handleFormSwitch("back"),
        styleType: "back-btn",
      },
      {
        type: "submit",
        text: "Registrarse",
        icon: "fas fa-user-plus",
        styleType: "register-btn",
      },
    ],
  };

  return (
    <div className="register-form-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="register-form">
          <header>
            <div className="form-header">Registro</div>
          </header>
          <form onSubmit={handleSubmit}>
            {Object.entries(formFieldsSections).map(([sectionKey, fields]) => {
              const sectionTitle =
                sectionKey === "first"
                  ? "Información Personal"
                  : sectionKey === "second"
                  ? "Información de Identidad"
                  : "Información de Acceso";
              return (
                <div
                  key={sectionKey}
                  className={`form ${sectionKey} ${
                    activeForm === sectionKey ? "active" : ""
                  }`}
                >
                  <div className="title">{sectionTitle}</div>
                  <div className="section">
                    <div className="section-content">
                      {fields.map((field, idx) => (
                        <div key={idx} className="field-item">
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="actions">
              <div className="btn-group">
                {buttonConfigs[activeForm].map((btn, idx) => (
                  <Button key={idx} {...btn} />
                ))}
              </div>
              {activeForm === "first" && (
                <div className="login-link">
                  ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;

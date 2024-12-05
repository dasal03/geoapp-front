import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../utils/apiClient";
import LoadingSpinner from "../loading/LoadingSpinner";
import InputField from "../inputField/InputField";
import PasswordField from "../passwordField/PasswordField";
import PhoneField from "../phoneField/PhoneField";
import DateInput from "../dateInput/DateInput";
import Button from "../button/Button";
import "../../pages/register/Register.scss";

const RegisterForm = () => {
  const [activeForm, setActiveForm] = useState("first");
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, eventOrValue) => {
    const value = eventOrValue.target
      ? eventOrValue.target.value
      : eventOrValue;
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiFetch("/create_user", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      if (response.responseCode === 201) {
        navigate("/login");
      } else {
        setError(response.data || "Error en el registro.");
      }
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSwitch = (direction) => {
    if (direction === "next") {
      if (activeForm === "first") setActiveForm("second");
      else if (activeForm === "second") setActiveForm("third");
    } else if (direction === "back") {
      if (activeForm === "third") setActiveForm("second");
      else if (activeForm === "second") setActiveForm("first");
    }
  };

  const formFields = {
    first: [
      {
        label: "Primer Nombre",
        type: "text",
        placeholder: "Ingrese su primer nombre",
        name: "first_name",
      },
      {
        label: "Segundo Nombre",
        type: "text",
        placeholder: "Ingrese su segundo nombre",
        name: "middle_name",
      },
      {
        label: "Apellido",
        type: "text",
        placeholder: "Ingrese su apellido",
        name: "last_name",
      },
      {
        label: "Usuario",
        type: "text",
        placeholder: "Ingrese su usuario",
        name: "username",
      },
      {
        label: "Contraseña",
        type: "password",
        placeholder: "Ingrese su contraseña",
        name: "password",
      },
      {
        label: "Confirmar Contraseña",
        type: "password",
        placeholder: "Confirme su contraseña",
        name: "confirm_password",
      },
    ],
    second: [
      {
        label: "Número de Teléfono",
        type: "phone",
        placeholder: "Ingrese su teléfono",
        name: "phone",
      },
      {
        label: "Fecha de Nacimiento",
        type: "date",
        name: "date_of_birth",
      },
      {
        label: "Género",
        type: "select",
        placeholder: "Ingrese su género",
        name: "gender_id",
      },
      {
        label: "Dirección",
        type: "text",
        placeholder: "Colombia, Atlántico, Barranquilla",
        name: "address",
      },
    ],
    third: [
      {
        label: "Tipo de Documento",
        type: "select",
        placeholder: "Ingrese su tipo de documento",
        name: "document_type",
      },
      {
        label: "Número de Documento",
        type: "text",
        placeholder: "Ingrese su número de documento",
        name: "document_number",
      },
      {
        label: "Lugar de Expedición",
        type: "text",
        placeholder: "Colombia, Atlántico, Barranquilla",
        name: "issue_place",
      },
      {
        label: "Fecha de Expedición",
        type: "date",
        name: "issue_date",
      },
    ],
  };

  return (
    <div className="register-form-container">
      <div className="register-form">
        <header>
          <div className="form-header">Registro</div>
          <div className="decorator"></div>
        </header>
        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            Object.keys(formFields).map((formKey) => (
              <div
                key={formKey}
                className={`form ${formKey} ${
                  activeForm === formKey ? "active" : ""
                }`}
              >
                <div className="title">
                  {formKey === "first"
                    ? "Información de la cuenta"
                    : formKey === "second"
                    ? "Información Personal"
                    : "Información de Identidad"}
                </div>
                <div className="section">
                  <div className="section-content">
                    {formFields[formKey].map((field, index) => (
                      <div key={index} className="field-item">
                        {field.type === "password" ? (
                          <PasswordField
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formValues[field.name] || ""}
                            onChange={(value) =>
                              handleChange(field.name, value)
                            }
                          />
                        ) : field.type === "phone" ? (
                          <PhoneField
                            label={field.label}
                            value={formValues.phone}
                            onChange={(updatedPhone) =>
                              handleChange("phone", updatedPhone)
                            }
                          />
                        ) : field.type === "date" ? (
                          <DateInput
                            label={field.label}
                            placeholder={field.placeholder}
                            value={formValues[field.name] || ""}
                            onChange={(value) =>
                              handleChange(field.name, value)
                            }
                          />
                        ) : (
                          <InputField
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formValues[field.name] || ""}
                            onChange={(value) =>
                              handleChange(field.name, value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
          {error && <div className="error-message">{error}</div>}
          <div className="button-container">
            {activeForm !== "first" && (
              <div className="back-button">
                <Button
                  className="backBtn"
                  type="button"
                  text="Atrás"
                  icon="fas fa-arrow-left"
                  onClick={() => handleFormSwitch("back")}
                />
              </div>
            )}
            {activeForm !== "third" && (
              <div className="next-button">
                <Button
                  className="nextBtn"
                  type="button"
                  text="Siguiente"
                  icon="fas fa-arrow-right"
                  onClick={() => handleFormSwitch("next")}
                />
              </div>
            )}
            {activeForm === "third" && (
              <div className="submit-button">
                <Button
                  className="submitBtn"
                  type="submit"
                  text="Registrar"
                  icon="fas fa-sign-in-alt"
                  onClick={handleSubmit}
                />
              </div>
            )}
            {activeForm === "first" && (
              <div className="login-link">
                <p>
                  ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

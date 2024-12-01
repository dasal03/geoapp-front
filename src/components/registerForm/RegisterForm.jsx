import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../utils/apiClient";
import LoadingSpinner from "../loading/LoadingSpinner";
import PasswordField from "../passwordField/PasswordField";
import InputField from "../inputField/InputField";
import Button from "../button/Button";
import "../../pages/register/Register.scss";

const RegisterForm = () => {
  const [activeForm, setActiveForm] = useState("first");
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formValues.password !== formValues.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      ...formValues,
    };

    setIsLoading(true);
    try {
      const response = await apiFetch("/create_user", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.responseCode === 201) {
        navigate("/login");
      } else {
        setError(response.data || "Error en el registro.");
      }
    } catch (err) {
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
        label: "Nombres",
        type: "text",
        placeholder: "Ingrese sus nombres",
        name: "name",
      },
      {
        label: "Apellidos",
        type: "text",
        placeholder: "Ingrese sus apellidos",
        name: "lastName",
      },
      {
        label: "Teléfono",
        type: "text",
        placeholder: "Ingrese su teléfono",
        name: "phone",
      },
      {
        label: "Dirección",
        type: "text",
        placeholder: "Ingrese su dirección",
        name: "address",
      },
      {
        label: "Correo Electrónico",
        type: "email",
        placeholder: "Ingrese su correo electrónico",
        name: "email",
      },
      {
        label: "Usuario",
        type: "text",
        placeholder: "Ingrese su usuario",
        name: "username",
      },
    ],
    second: [
      {
        label: "Nombre de la Empresa",
        type: "text",
        placeholder: "Ingrese el nombre de la empresa",
        name: "company",
      },
      {
        label: "Posición",
        type: "text",
        placeholder: "Ingrese su posición",
        name: "position",
      },
      {
        label: "Teléfono",
        type: "text",
        placeholder: "Ingrese su teléfono",
        name: "phoneCompany",
      },
      {
        label: "Dirección",
        type: "text",
        placeholder: "Ingrese su dirección",
        name: "addressCompany",
      },
      {
        label: "Correo Electrónico",
        type: "email",
        placeholder: "Ingrese su correo electrónico",
        name: "emailCompany",
      },
      {
        label: "Fecha de Ingreso",
        type: "date",
        placeholder: "",
        name: "date",
      },
    ],
    third: [
      {
        label: "Nombre del Banco",
        type: "text",
        placeholder: "Ingrese el nombre del banco",
        name: "nameBank",
      },
      {
        label: "Número de Cuenta",
        type: "text",
        placeholder: "Ingrese su cuenta",
        name: "accountNumber",
      },
      {
        label: "Teléfono",
        type: "text",
        placeholder: "Ingrese su teléfono",
        name: "phoneBank",
      },
      {
        label: "Dirección",
        type: "text",
        placeholder: "Ingrese su dirección",
        name: "addressBank",
      },
      {
        label: "Correo Electrónico",
        type: "email",
        placeholder: "Ingrese su correo electrónico",
        name: "emailBank",
      },
    ],
  };

  return (
    <div className="register-form">
      <header>Registro</header>
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {Object.keys(formFields).map((formKey) => (
              <div
                key={formKey}
                className={`form ${formKey} ${
                  activeForm === formKey ? "active" : ""
                }`}
              >
                <div className="title">
                  {formKey === "first"
                    ? "Datos Personales"
                    : formKey === "second"
                    ? "Información Laboral"
                    : "Información Bancaria"}
                </div>
                <div className="fields">
                  {formFields[formKey].map((field, index) => (
                    <InputField
                      key={index}
                      label={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formValues[field.name]}
                      onChange={(value) => handleChange(field.name, value)}
                    />
                  ))}
                  {formKey === "first" && (
                    <>
                      <PasswordField
                        label="Contraseña"
                        placeholder="Ingrese su contraseña"
                        value={formValues.password}
                        onChange={(value) => handleChange("password", value)}
                      />
                      <PasswordField
                        label="Confirmar Contraseña"
                        placeholder="Confirme su contraseña"
                        value={formValues.confirmPassword}
                        onChange={(value) =>
                          handleChange("confirmPassword", value)
                        }
                      />
                    </>
                  )}
                </div>
                <div className="buttons">
                  {formKey !== "first" && (
                    <Button
                      text="Volver"
                      icon="fas fa-arrow-left"
                      onClick={() => handleFormSwitch("back")}
                    />
                  )}
                  {formKey !== "third" ? (
                    <Button
                      text="Siguiente"
                      icon="fas fa-arrow-right"
                      onClick={() => handleFormSwitch("next")}
                    />
                  ) : (
                    <Button
                      type="submit"
                      text="Registrar"
                      icon="fas fa-check"
                    />
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RegisterForm;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../utils/generalTools";
import apiFetch from "../../utils/apiClient";
import InputField from "../inputField/InputField";
import PasswordField from "../passwordField/PasswordField";
import SelectField from "../selectField/SelectField";
import PhoneField from "../phoneField/PhoneField";
import DateInputField from "../dateInputField/DateInputField";
import Button from "../button/Button";
import LoadingSpinner from "../loading/LoadingSpinner";
import "../../pages/register/Register.scss";

const RegisterForm = () => {
  const [activeForm, setActiveForm] = useState("first");
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [issueCities, setIssueCities] = useState([]);
  const navigate = useNavigate();

  const fetchData = async (url, setData, formatData) => {
    try {
      setIsLoading(true);
      const response = await apiFetch(url);
      if (response.responseCode === 200) {
        const formattedData = formatData(response.data);
        setData(formattedData);
      } else if (response.responseCode === 404) {
        setData([]);
      } else {
        showAlert("error", "Error", `Error al obtener datos de ${url}.`);
      }
    } catch {
      showAlert("error", "Error", "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData("/get_document_types", setDocumentTypes, (data) =>
      data.map((doc) => ({ id: doc.document_type_id, name: doc.description }))
    );
    fetchData("/get_genders", setGenders, (data) =>
      data.map((gen) => ({ id: gen.gender_id, name: gen.gender_name }))
    );
    fetchData("/get_states", setStates, (data) =>
      data.map((state) => ({ id: state.state_id, name: state.state_name }))
    );
  }, []);

  useEffect(() => {
    if (formValues.state_id) {
      fetchData(
        `/get_cities?state_id=${formValues.state_id}`,
        setCities,
        (data) =>
          data.map((city) => ({ id: city.city_id, name: city.city_name }))
      );
      setFormValues((prev) => ({ ...prev, city_id: "" }));
    } else {
      setCities([]);
      setFormValues((prev) => ({ ...prev, city_id: "" }));
    }
  }, [formValues.state_id]);

  useEffect(() => {
    if (formValues.state_of_issue_id) {
      fetchData(
        `/get_cities?state_id=${formValues.state_of_issue_id}`,
        setIssueCities,
        (data) =>
          data.map((city) => ({ id: city.city_id, name: city.city_name }))
      );
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    } else {
      setIssueCities([]);
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    }
  }, [formValues.state_of_issue_id]);

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
      const userResponse = await apiFetch("/create_user", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      if (userResponse.responseCode === 201) {
        const userId = userResponse.data.user_id;

        const addressPayload = {
          user_id: userId,
          state_id: formValues.state_id,
          city_id: formValues.city_id,
          address: formValues.address,
        };

        const addressResponse = await apiFetch("/create_address", {
          method: "POST",
          body: JSON.stringify(addressPayload),
        });

        if (addressResponse.responseCode === 201) {
          navigate("/login");
        } else {
          setError("Error al registrar la dirección.");
        }
      } else if (userResponse.responseCode === 400) {
        setError(userResponse.description);
      } else {
        setError(userResponse.data || "Error en el registro.");
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
    window.scrollTo(0, 0);
  };

  const formFields = {
    first: [
      {
        label: "Nombre",
        type: "text",
        placeholder: "Ingrese su nombre",
        name: "first_name",
      },
      {
        label: "Apellido",
        type: "text",
        placeholder: "Ingrese su apellido",
        name: "last_name",
      },
      {
        label: "Correo",
        type: "email",
        placeholder: "Ingrese su correo",
        name: "email",
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
        name: "phone_number",
      },
      {
        label: "Fecha de Nacimiento",
        type: "date",
        name: "date_of_birth",
      },
      {
        label: "Género",
        type: "select",
        placeholder: "Seleccione un género",
        name: "gender_id",
        options: genders,
      },
      {
        label: "Departamento",
        type: "select",
        placeholder: "Seleccione un departamento",
        name: "state_id",
        options: states,
      },
      {
        label: "Ciudad",
        type: "select",
        placeholder: "Seleccione una ciudad",
        name: "city_id",
        options: cities,
        disabled: isLoading || !formValues.state_id || cities.length === 0,
      },
      {
        label: "Dirección",
        type: "text",
        placeholder: "Ingrese su dirección",
        name: "address",
      },
    ],
    third: [
      {
        label: "Tipo de Documento",
        type: "select",
        placeholder: "Seleccione un tipo de documento",
        name: "document_type_id",
        options: documentTypes,
      },
      {
        label: "Número de Documento",
        type: "text",
        placeholder: "Ingrese su número de documento",
        name: "document_number",
      },
      {
        label: "Departamento de Expedición",
        type: "select",
        placeholder: "Seleccione un departamento",
        name: "state_of_issue_id",
        options: states,
      },
      {
        label: "Ciudad de Expedición",
        type: "select",
        placeholder: "Seleccione una ciudad",
        name: "city_of_issue_id",
        options: issueCities,
        disabled:
          isLoading || !formValues.state_of_issue_id || issueCities.length === 0,
      },
      {
        label: "Fecha de Expedición",
        type: "date",
        name: "date_of_issue",
      },
    ],
  };

  const renderField = (field) => {
    const value = formValues[field.name] || "";
    switch (field.type) {
      case "text":
      case "email":
        return (
          <InputField
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e)}
            placeholder={field.placeholder}
          />
        );
      case "password":
        return (
          <PasswordField
            label={field.label}
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(field.name, e)}
            placeholder={field.placeholder}
          />
        );
      case "select":
        return (
          <SelectField
            label={field.label}
            options={field.options}
            value={value}
            onChange={(e) => handleChange(field.name, e)}
            placeholder={field.placeholder}
            disabled={field.disabled || false}
          />
        );
      case "phone":
        return (
          <PhoneField
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e)}
            placeholder={field.placeholder}
          />
        );
      case "date":
        return (
          <DateInputField
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e)}
          />
        );
      default:
        return null;
    }
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
            Object.entries(formFields).map(([formKey, fields]) => (
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
                    {fields.map((field, index) => (
                      <div key={index} className="field-item">
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="error-container">
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="actions">
            {activeForm !== "first" && (
              <div
                className={`back-btn ${
                  activeForm === "second" ? "back-active" : ""
                }`}
              >
                <Button
                  type="button"
                  text="Volver"
                  icon="fas fa-arrow-left"
                  onClick={() => handleFormSwitch("back")}
                />
              </div>
            )}
            {activeForm !== "third" && (
              <div
                className={`next-btn ${
                  activeForm === "second" ? "next-active" : ""
                }`}
              >
                <Button
                  type="button"
                  text="Siguiente"
                  icon="fas fa-arrow-right"
                  onClick={() => handleFormSwitch("next")}
                />
              </div>
            )}
            {activeForm === "third" && (
              <div
                className={`register-btn ${
                  activeForm === "third" ? "register-active" : ""
                }`}
              >
                <Button
                  type="submit"
                  text="Registrarse"
                  icon="fas fa-user-plus"
                  onClick={() => handleFormSwitch("next")}
                />
              </div>
            )}
            {activeForm === "first" && (
              <div className="login-link">
                ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

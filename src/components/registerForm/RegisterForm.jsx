import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { showAlert } from "../../utils/generalTools";
import apiFetch from "../../utils/apiClient";
import Validator from "../../utils/formValidator";
import InputField from "../ui/inputField/InputField";
import PasswordField from "../ui/passwordField/PasswordField";
import SelectField from "../ui/selectField/SelectField";
import PhoneField from "../ui/phoneField/PhoneField";
import DateInputField from "../ui/dateInputField/DateInputField";
import Button from "../ui/button/Button";
import LoadingSpinner from "../loading/LoadingSpinner";
import "../../pages/register/Register.scss";

const RegisterForm = () => {
  const [activeForm, setActiveForm] = useState("first");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [issueCities, setIssueCities] = useState([]);
  const navigate = useNavigate();

  const fetchData = async (url, setData, formatData) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchData("/get_document_types", setDocumentTypes, (data) =>
      data.map((doc) => ({
        value: doc.document_type_id,
        label: doc.description,
      }))
    );
    fetchData("/get_genders", setGenders, (data) =>
      data.map((gen) => ({ value: gen.gender_id, label: gen.gender_name }))
    );
    fetchData("/get_states", setStates, (data) =>
      data.map((state) => ({ value: state.state_id, label: state.state_name }))
    );
  }, []);

  useEffect(() => {
    if (formValues.state_id) {
      fetchData(
        `/get_cities?state_id=${formValues.state_id}`,
        setCities,
        (data) =>
          data.map((city) => ({ value: city.city_id, label: city.city_name }))
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
          data.map((city) => ({ value: city.city_id, label: city.city_name }))
      );
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    } else {
      setIssueCities([]);
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    }
  }, [formValues.state_of_issue_id]);

  const handleChange = (field, eventOrValue) => {
    const value = eventOrValue?.target?.value ?? eventOrValue ?? "";
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    if (value && value.trim() !== "") {
      setFormError((prevError) => {
        if (prevError.field === field) {
          return { field: null, message: "" };
        }
        return prevError;
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      "phone_number": value,
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
          setError(
            addressResponse.description || "Error al registrar la dirección."
          );
        }
      } else {
        setError(userResponse.description || "Error al registrar el usuario.");
      }
    } catch {
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = {
    first: [
      {
        label: "Nombre",
        type: "text",
        value: formValues.first_name,
        placeholder: "Ingrese su nombre",
        name: "first_name",
        required: true,
      },
      {
        label: "Apellido",
        type: "text",
        value: formValues.last_name,
        placeholder: "Ingrese su apellido",
        name: "last_name",
        required: true,
      },
      {
        label: "Correo",
        type: "email",
        value: formValues.email,
        placeholder: "Ingrese su correo",
        name: "email",
        required: true,
      },
      {
        label: "Usuario",
        type: "text",
        value: formValues.username,
        placeholder: "Ingrese su usuario",
        name: "username",
        required: true,
      },
      {
        label: "Contraseña",
        type: "password",
        value: formValues.password,
        placeholder: "Ingrese su contraseña",
        name: "password",
        required: true,
      },
      {
        label: "Confirmar Contraseña",
        type: "password",
        value: formValues.confirm_password,
        placeholder: "Confirme su contraseña",
        name: "confirm_password",
        required: true,
      },
    ],
    second: [
      {
        label: "Número de Teléfono",
        type: "phone",
        value: formValues.phone_number,
        placeholder: "Ingrese su teléfono",
        name: "phone_number",
        required: true,
      },
      {
        label: "Fecha de Nacimiento",
        type: "date",
        value: formValues.date_of_birth,
        name: "date_of_birth",
        required: true,
      },
      {
        label: "Género",
        type: "select",
        value: formValues.gender_id,
        name: "gender_id",
        placeholder: "Seleccione un género",
        options: genders,
        required: true,
      },
      {
        label: "Departamento",
        type: "select",
        value: formValues.state_id,
        placeholder: "Seleccione un departamento",
        name: "state_id",
        options: states,
        required: true,
      },
      {
        label: "Ciudad",
        type: "select",
        value: formValues.city_id,
        placeholder: "Seleccione una ciudad",
        name: "city_id",
        options: cities,
        disabled: isLoading || !formValues.state_id || cities.length === 0,
        required: true,
      },
      {
        label: "Dirección",
        type: "text",
        value: formValues.address,
        placeholder: "Ingrese su dirección",
        name: "address",
        required: true,
      },
    ],
    third: [
      {
        label: "Tipo de Documento",
        type: "select",
        value: formValues.document_type_id,
        placeholder: "Seleccione un tipo de documento",
        name: "document_type_id",
        options: documentTypes,
        required: true,
      },
      {
        label: "Número de Documento",
        type: "text",
        value: formValues.document_number,
        placeholder: "Ingrese su número de documento",
        name: "document_number",
        required: true,
      },
      {
        label: "Departamento de Expedición",
        type: "select",
        value: formValues.state_of_issue_id,
        placeholder: "Seleccione un departamento",
        name: "state_of_issue_id",
        options: states,
        required: true,
      },
      {
        label: "Ciudad de Expedición",
        type: "select",
        value: formValues.city_of_issue_id,
        placeholder: "Seleccione una ciudad",
        name: "city_of_issue_id",
        options: issueCities,
        disabled:
          isLoading ||
          !formValues.state_of_issue_id ||
          issueCities.length === 0,
        required: true,
      },
      {
        label: "Fecha de Expedición",
        type: "date",
        value: formValues.date_of_issue,
        name: "date_of_issue",
        required: true,
      },
    ],
  };

  const handleFormSwitch = (direction) => {
    const currentFields = formFields[activeForm];
    const validator = new Validator(formValues);
    const validation = validator.validateSection(currentFields);

    if (direction === "next") {
      if (validation.isValid) {
        if (activeForm === "first") setActiveForm("second");
        else if (activeForm === "second") setActiveForm("third");
      } else {
        setFormError({ field: validation.field, message: validation.message });
      }
    } else if (direction === "back") {
      if (activeForm === "third") setActiveForm("second");
      else if (activeForm === "second") setActiveForm("first");
    }
    window.scrollTo(0, 0);
  };

  const renderField = (field) => {
    const value = formValues[field.name] ?? "";
    const hasError = formError.field === field.name;
    const errorMessage = hasError ? formError.message : "";

    const errorClass = hasError ? `${field.type}-error` : "";

    const renderFieldWithError = (FieldComponent, additionalProps = {}) => (
      <div className={`field-wrapper ${hasError ? "error" : ""}`}>
        <FieldComponent {...commonProps} {...additionalProps} />
        {hasError && <span className="error-message">{errorMessage}</span>}
      </div>
    );

    const commonProps = {
      label: field.label,
      value,
      placeholder: field.placeholder,
      onChange: (e) => handleChange(field.name, e),
      styleType: `form-${field.type} ${errorClass}`,
      disabled: field.disabled || false,
    };

    switch (field.type) {
      case "text":
      case "email":
        return renderFieldWithError(InputField);
      case "password":
        const isConfirmPasswordField = field.name === "confirm_password";
        const passwordValue = formValues.password || "";
        const confirmPasswordValue = formValues.confirm_password || "";

        const passwordError =
          isConfirmPasswordField &&
          confirmPasswordValue.trim() !== "" &&
          confirmPasswordValue !== passwordValue;
        const passwordSuccess =
          isConfirmPasswordField &&
          confirmPasswordValue === passwordValue &&
          confirmPasswordValue.trim() !== "";

        const passwordStyleType = `form-${field.type} ${
          passwordError ? "password-error" : ""
        } ${passwordSuccess ? "password-success" : ""} ${errorClass}`;

        return (
          <div
            className={`field-wrapper ${
              hasError || passwordError
                ? "error"
                : isConfirmPasswordField && passwordSuccess
                ? "success"
                : ""
            }`}
          >
            <PasswordField {...commonProps} styleType={passwordStyleType} />
            {hasError && <span className="error-message">{errorMessage}</span>}
            {passwordError && (
              <span className="error-message">
                Las contraseñas no coinciden.
              </span>
            )}
          </div>
        );
      case "select":
        return renderFieldWithError(SelectField, { options: field.options });
      case "phone":
        return renderFieldWithError(PhoneField, {
          handlePhoneChange: handlePhoneChange,
        });
      case "date":
        return renderFieldWithError(DateInputField);
      default:
        return null;
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form">
        <header>
          <div className="form-header">Registro</div>
        </header>
        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            Object.entries(formFields).map(([formKey, fields]) => {
              const title =
                formKey === "first"
                  ? "Información de la cuenta"
                  : formKey === "second"
                  ? "Información Personal"
                  : "Información del documento";

              return (
                <div
                  key={formKey}
                  className={`form ${formKey} ${
                    activeForm === formKey ? "active" : ""
                  }`}
                >
                  <div className="title">{title}</div>
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
              );
            })
          )}
          <div className="error-container">
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="actions">
            <div className="btn-group">
              {activeForm === "first" && (
                <Button
                  type="button"
                  text="Siguiente"
                  icon="fas fa-arrow-right"
                  onClick={() => handleFormSwitch("next")}
                  styleType="next-btn"
                />
              )}

              {activeForm === "second" && (
                <>
                  <Button
                    type="button"
                    text="Volver"
                    icon="fas fa-arrow-left"
                    onClick={() => handleFormSwitch("back")}
                    styleType="back-btn"
                    disabled={activeForm === "first"}
                  />
                  <Button
                    type="button"
                    text="Siguiente"
                    icon="fas fa-arrow-right"
                    onClick={() => handleFormSwitch("next")}
                    styleType="next-btn"
                  />
                </>
              )}

              {activeForm === "third" && (
                <>
                  <Button
                    type="button"
                    text="Volver"
                    icon="fas fa-arrow-left"
                    onClick={() => handleFormSwitch("back")}
                    styleType="back-btn"
                    disabled={activeForm === "first"}
                  />
                  <Button
                    type="submit"
                    text="Registrarse"
                    icon="fas fa-user-plus"
                    onClick={() => handleFormSwitch("next")}
                    styleType="register-btn"
                  />
                </>
              )}
            </div>

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

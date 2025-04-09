import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiFetch from "../../../../utils/apiClient";
import { useAlert } from "../../../../context/alertProvider";
import { PasswordField } from "../../../../components/ui";
import { Button, Loader } from "../../../../components/ui";
import "./ChangePassword.scss";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const { showAlert } = useAlert();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    setErrorMessage("");
    const payload = {
      user_id: userId,
      ...formData,
    };

    setLoading(true);
    try {
      const response = await apiFetch("/update_user", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response) {
        showAlert(
          "success",
          "Exito",
          "La contraseña se ha actualizado correctamente."
        );
        setFormData({});
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const section = {
    title: "Cambio de Contraseña",
    fields: [
      {
        name: "password",
        label: "Nueva Contraseña",
        type: "password",
        placeholder: "Nueva Contraseña",
        required: true,
      },
      {
        name: "confirm_password",
        label: "Confirmar Contraseña",
        type: "password",
        placeholder: "Confirmar Contraseña",
        required: true,
      },
    ],
  };

  return (
    <section className="form-section change-password">
      <h3 className="form-section-title">{section.title}</h3>

      {loading && <Loader />}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-fields">
          {section.fields.map((field, index) => (
            <div key={index} className="form-field">
              <PasswordField
                label={field.label}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(value) => handleInputChange(field.name, value)}
                required={field.required}
              />
            </div>
          ))}
        </div>
        <Button
          text="Actualizar Contraseña"
          icon="fas fa-save"
          type="submit"
          styleType="btn-change-password"
        />
      </form>
    </section>
  );
};

export default ChangePassword;

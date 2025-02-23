import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAlert } from "../../../../context/alertProvider";
import apiFetch from "../../../../utils/apiClient";
import PasswordField from "../../../../components/ui/passwordField/PasswordField";
import Button from "../../../../components/ui/button/Button";
import Loader from "../../../../components/ui/loader/Loader";
import "./ChangePassword.scss";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [errors, setErrors] = useState({});

  const { showAlert } = useAlert();

  const validateFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Este campo es obligatorio.";
      }
    });

    if (
      formData.new_password &&
      formData.confirm_new_password &&
      formData.new_password !== formData.confirm_new_password
    ) {
      newErrors.confirm_new_password = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!value) {
        newErrors[key] = "Este campo es obligatorio.";
      } else {
        delete newErrors[key];
      }

      if (
        key === "confirm_new_password" &&
        formData.new_password &&
        value !== formData.new_password
      ) {
        newErrors[key] = "Las contraseñas no coinciden.";
      } else if (key === "confirm_new_password") {
        delete newErrors[key];
      }

      return newErrors;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    const { new_password, confirm_password } = formData;

    try {
      const response = await apiFetch("/update_user", {
        method: "PUT",
        body: JSON.stringify({
          user_id: userId,
          new_password,
          confirm_password,
        }),
      });

      if (response.responseCode === 200) {
        showAlert(
          "success",
          "Éxito",
          "Tu contraseña ha sido actualizada correctamente."
        );
        setFormData({
          new_password: "",
          confirm_new_password: "",
        });
        setErrors({});
      } else {
        showAlert(
          "error",
          "Error",
          response.description || "Error inesperado."
        );
      }
    } catch (error) {
      showAlert("error", "Error", "No se pudo actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  const section = {
    title: "Cambio de Contraseña",
    fields: [
      {
        name: "new_password",
        label: "Nueva Contraseña",
        type: "password",
        placeholder: "Nueva Contraseña",
        required: true,
      },
      {
        name: "confirm_new_password",
        label: "Confirmar Nueva Contraseña",
        type: "password",
        placeholder: "Confirmar Nueva Contraseña",
        required: true,
      },
    ],
  };

  return (
    <section className="form-section">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h3 className="form-section-title">{section.title}</h3>
          <form onSubmit={handleSave}>
            <div className="form-fields">
              {section.fields.map((field, index) => (
                <div key={index} className="form-field">
                  <PasswordField
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(value) => handleInputChange(field.name, value)}
                  />
                  {errors[field.name] && (
                    <span className="error-message">{errors[field.name]}</span>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="submit"
              text="Actualizar Contraseña"
              icon="fas fa-save"
              styleType="btn-change-password"
            />
          </form>
        </>
      )}
    </section>
  );
};

export default ChangePassword;

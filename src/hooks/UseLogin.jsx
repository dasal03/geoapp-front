import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/alertProvider";
import Validator from "../utils/formValidator";

const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [formValues, setFormValues] = useState({ username: "", password: "" });

  const fields = [
    {
      label: "Usuario",
      name: "username",
      type: "text",
      placeholder: "Ingresa tu usuario",
      required: true,
    },
    {
      label: "Contraseña",
      name: "password",
      type: "password",
      placeholder: "Ingresa tu contraseña",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});

    const validation = new Validator(formValues).validateSection(fields);
    if (!validation.isValid) return setFormError(validation.errors);

    setLoading(true);
    const response = await login(formValues.username, formValues.password);

    setLoading(false);
    if (!response.success)
      return showAlert("error", "Error de autenticación", response.message);

    navigate("/services/management");
  };

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormError((prev) => ({ ...prev, [key]: "" }));
  };

  return { fields, formValues, formError, handleSubmit, handleChange, loading };
};

export default useLogin;

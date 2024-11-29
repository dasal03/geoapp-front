import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../loading/LoadingSpinner";
import InputField from "../inputField/InputField";
import PasswordField from "../passwordField/PasswordField";
import Button from "../button/Button";
import "../../styles/pages/login.scss";

const LoginForm = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formValues.username, formValues.password);
      navigate("/services/management");
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="login-form">
      <header>Iniciar Sesión</header>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="fields">
              <InputField
                label="Usuario"
                type="text"
                placeholder="Ingresa tu usuario"
                value={formValues.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              <PasswordField
                label="Contraseña"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formValues.password}
                onChange={(value) => handleInputChange("password", value)}
              />
            </div>
            <div className="buttons">
              <Button
                type="submit"
                text="Iniciar Sesión"
                icon="fas fa-sign-in-alt"
              />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;

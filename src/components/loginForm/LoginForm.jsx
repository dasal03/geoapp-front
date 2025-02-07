import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/loader/Loader";
import InputField from "../ui/inputField/InputField";
import PasswordField from "../ui/passwordField/PasswordField";
import Button from "../ui/button/Button";
import "../../pages/login/Login.scss";

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
    <div className="login-container">
      <div className="login-form">
        <header className="form-header">Iniciar Sesión</header>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="fields">
                <InputField
                  label="Usuario"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={formValues.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  required
                />
                <PasswordField
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={formValues.password}
                  onChange={(value) => handleInputChange("password", value)}
                  required="true"
                  styleType="default"
                />
              </div>
              <div className="buttons">
                <Button
                  type="submit"
                  text="Iniciar Sesión"
                  icon="fas fa-sign-in-alt"
                />
              </div>
              <div className="register-link">
                ¿No tienes una cuenta? <Link to="/register">Crear cuenta</Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

import { Link } from "react-router-dom";
import useLogin from "../../hooks/UseLogin";
import Loader from "../ui/loader/Loader";
import InputField from "../ui/inputField/InputField";
import PasswordField from "../ui/passwordField/PasswordField";
import Button from "../ui/button/Button";

const LoginForm = () => {
  const { isLoading, formValues, error, handleSubmit, handleInputChange } =
    useLogin();

  return (
    <div className="login-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="login-form">
          <header className="form-header">Inicio de Sesión</header>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="fields">
              <InputField
                label="Nombre de Usuario"
                placeholder="Ingresa tu usuario"
                value={formValues.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
              <PasswordField
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={formValues.password}
                onChange={(value) => handleInputChange("password", value)}
                required
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
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

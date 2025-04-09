import { Link } from "react-router-dom";
import { useLogin } from "../../hooks";
import { InputField, PasswordField, Loader, Button } from "../ui";

const fieldComponents = {
  text: InputField,
  password: PasswordField,
};

const LoginForm = () => {
  const { fields, formValues, formError, handleSubmit, handleChange, loading } =
    useLogin();

  return (
    <div className="login-form-container">
      {loading ? (
        <Loader />
      ) : (
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <header className="form-header">Inicio de Sesión</header>

          <div className="fields">
            {fields.map(({ name, type, label, placeholder }) => {
              const Component = fieldComponents[type];
              return (
                <div
                  key={name}
                  className={`field-wrapper ${formError[name] ? "error" : ""}`}
                >
                  <Component
                    label={label}
                    name={name}
                    value={formValues[name] || ""}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(name, e.target.value)}
                    className={`form-${type}${formError[name] ? " error" : ""}`}
                    title={formError[name] || ""}
                    aria-invalid={!!formError[name]}
                    aria-describedby={
                      formError[name] ? `${name}-error` : undefined
                    }
                  />
                  {formError[name] && (
                    <span
                      className="error-message"
                      id={`${name}-error`}
                      aria-live="polite"
                    >
                      {formError[name]}
                    </span>
                  )}
                </div>
              );
            })}
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
      )}
    </div>
  );
};

export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Password } from "../password/Password";
import LoadingSpinner from "../loading/LoadingSpinner"; 
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/equipment_management");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar sesión</h2>
        {error && <p className="error-message">{error}</p>}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="input-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Password
              {...{
                type: "password",
                label: "Contraseña",
                name: "password",
                placeholder: "Ingresa tu contraseña",
                value: password,
                onChange: setPassword,
              }}
            />
            <button type="submit" onClick={handleSubmit}>
              Iniciar sesión
            </button>
            <a href="/register" className="register-link">
              ¿No tienes cuenta? Regístrate
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

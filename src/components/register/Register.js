import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Password } from "../password/Password";
import LoadingSpinner from "../loading/LoadingSpinner";
import "./Register.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(false);

    if (!fullname || !username || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      fullname,
      username,
      password,
      confirm_password: confirmPassword,
    };

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/dev/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Error en el registro.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registro</h2>
        {error && <p className="error-message">{error}</p>}
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
          <>
            <div className="input-group">
              <label htmlFor="fullname">Nombre Completo</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Ingresa tu nombre completo"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Password
              label="Contraseña"
              name="password"
              value={password}
              onChange={setPassword}
              placeholder="Ingresa tu contraseña"
            />
            <Password
              label="Confirmar Contraseña"
              name="Confirmar Contraseña"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirma tu contraseña"
            />
            <button type="submit" onClick={handleSubmit}>
              Registrar
            </button>
            <a href="/login" className="login-link">
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;

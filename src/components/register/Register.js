import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Password } from "../password/Password";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      fullname,
      username,
      password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:3000/dev/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Error en el registro");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registro</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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

        {/* <div className="input-group password-container">
          <label htmlFor="password">Contraseña</label>
          <input
            type={passwordType}
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon-container" onClick={togglePasswordVisibility}>
            {passwordIcon}
          </span>
          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <input
            type={confirmPasswordType}
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="icon-container"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordIcon}
          </span>
        </div> */}
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
      </div>
    </div>
  );
};

export default Register;

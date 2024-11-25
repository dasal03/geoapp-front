import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Password } from "../password/Password";
import "./Profile.css";

const Profile = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState({
    fullname: "",
    username: "",
  });
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setError("No se pudo obtener la información del usuario autenticado");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/dev/get_user?user_id=${authUser.user_id}`
        );
        const result = await response.json();

        if (response.ok && result.responseCode === 200) {
          const userData = result.data;
          setUser({
            fullname: userData.fullname || "",
            username: userData.username || "",
          });
        } else {
          setError("No se pudo obtener la información del usuario");
        }
      } catch (err) {
        setError("Error al conectar con el servidor");
      }
    };

    fetchUser();
  }, [authUser]);

  const handleFieldChange = (field, value) => {
    setPasswordFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));

    // Verificar si las contraseñas coinciden al modificar los campos
    if (field === "newPassword" || field === "confirmPassword") {
      setPasswordsMatch(
        field === "newPassword"
          ? value === passwordFields.confirmPassword
          : value === passwordFields.newPassword
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordFields;

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos deben estar llenos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/dev/update_user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: authUser.user_id,
          current_password: currentPassword,
          password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Contraseña actualizada con éxito");
        setPasswordFields({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsModalOpen(false);
      } else {
        const data = await response.json();
        setError(data.message || "Error al actualizar la contraseña");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>Perfil de Usuario</h2>

        <div className="input-group">
          <label htmlFor="fullname">Nombre Completo</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={user.fullname || ""}
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username || ""}
            readOnly
          />
        </div>

        <button type="button" onClick={() => setIsModalOpen(true)}>
          Actualizar Contraseña
        </button>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Actualizar Contraseña</h3>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <Password
                label="Contraseña Actual"
                name="currentPassword"
                value={passwordFields.currentPassword}
                onChange={(value) =>
                  handleFieldChange("currentPassword", value)
                }
                placeholder="Ingresa tu contraseña actual"
              />

              <Password
                label="Nueva Contraseña"
                name="newPassword"
                value={passwordFields.newPassword}
                onChange={(value) => handleFieldChange("newPassword", value)}
                placeholder="Ingresa tu nueva contraseña"
              />

              <Password
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                value={passwordFields.confirmPassword}
                onChange={(value) =>
                  handleFieldChange("confirmPassword", value)
                }
                placeholder="Confirma tu nueva contraseña"
              />

              {!passwordsMatch && (
                <p className="error-message">Las contraseñas no coinciden</p>
              )}

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  !passwordsMatch ||
                  !passwordFields.currentPassword ||
                  !passwordFields.newPassword ||
                  !passwordFields.confirmPassword
                }
                className="update-button"
              >
                Actualizar Contraseña
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

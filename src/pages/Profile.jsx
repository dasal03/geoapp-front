import React from "react";
import "../styles/pages/profile.scss";
import placeholderProfileImage from "../assets/profile-placeholder.jpg";

function Profile() {
  const profileImage = null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={profileImage || placeholderProfileImage}
            alt="Imagen de perfil"
          />
        </div>
        <div className="profile-info">
          <h1>John Doe</h1>
          <p>john.doe@example.com</p>
          <p>Miembro desde: Enero 2022</p>
        </div>
      </div>

      <div className="profile-body">
        <section className="profile-section">
          <h2>Información Personal</h2>
          <p>
            <strong>Nombre:</strong> John Doe
          </p>
          <p>
            <strong>Email:</strong> john.doe@example.com
          </p>
          <p>
            <strong>Teléfono:</strong> +123 456 789
          </p>
        </section>

        <section className="profile-section">
          <h2>Configuraciones</h2>
          <button className="action-btn">Editar Perfil</button>
          <button className="action-btn danger">Eliminar Cuenta</button>
        </section>
      </div>
    </div>
  );
}

export default Profile;

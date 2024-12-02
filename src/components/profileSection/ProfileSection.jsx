import React from "react";

const ProfileSection = ({ title, fields, isEditing, handleChange }) => {
  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <div key={index}>
          <strong>{field.label}:</strong>
          {field.name === "Acciones" ? (
            // Aquí renderizamos los botones directamente
            <div>{field.value}</div>
          ) : isEditing ? (
            // Si está en modo edición, mostramos un input
            <input
              type="text"
              name={field.name}
              value={field.value}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          ) : (
            // Si no está en modo edición, mostramos el valor en un <p>
            <p>{field.value}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default ProfileSection;

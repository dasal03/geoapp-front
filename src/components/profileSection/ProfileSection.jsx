import React from "react";

const ProfileSection = ({ title, fields, isEditing, handleChange }) => {
  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <div key={index}>
          <strong>{field.label}:</strong>
          {field.name === "Acciones" ? (
            <div>{field.value}</div>
          ) : isEditing ? (
            <input
              type="text"
              name={field.name}
              value={field.value}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          ) : (
            <p>{field.value}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default ProfileSection;

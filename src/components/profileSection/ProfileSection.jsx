import React from "react";

const ProfileSection = ({ title, fields }) => {
  return (
    <section className="profile-section">
      <h2>{title}</h2>
      {fields.map((field, index) => (
        <p key={index}>
          <strong>{field.label}:</strong> {field.value}
        </p>
      ))}
    </section>
  );
};

export default ProfileSection;

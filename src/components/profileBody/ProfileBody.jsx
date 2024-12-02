import React from "react";
import ProfileSection from "../../components/profileSection/ProfileSection";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const {
    full_name,
    email,
    indicative_code,
    phone_number,
    gender_name,
    date_of_birth,
    document_type,
    document_number,
    issue_date,
    issue_city,
    country_name,
    state_name,
    city_name,
    address,
  } = profileData;

  const personalInfoFields = [
    { label: "Nombre", value: full_name },
    { label: "Email", value: email },
    { label: "Teléfono", value: (indicative_code) + " " + (phone_number)},
    { label: "Género", value: gender_name },
    { label: "Fecha de nacimiento", value: date_of_birth },
  ];

  const documentInfoFields = [
    { label: "Tipo de documento", value: document_type },
    { label: "Número de documento", value: document_number },
    { label: "Fecha de expedicción", value: issue_date },
    { label: "Lugar de expedición", value: issue_city },
  ];

  const addressInfoFields = [
    { label: "País", value: country_name },
    { label: "Provincia", value: state_name },
    { label: "Ciudad", value: city_name },
    { label: "Dirección", value: address },
  ];

  const paymentInfoFields = [
    { label: "Banco", value: "Banco de Chile" },
    { label: "Tipo de cuenta", value: "Cuenta Corriente" },
    { label: "Número de cuenta", value: "123456789" },
  ];

  const settingsFields = [
    {
      label: "Acciones",
      value: (
        <>
          <button className="action-btn">Editar Perfil</button>
          <button className="action-btn danger">Eliminar Cuenta</button>
        </>
      ),
    },
  ];

  return (
    <div className="profile-body">
      <ProfileSection
        title="Información Personal"
        fields={personalInfoFields}
      />
      <ProfileSection
        title="Información del Documento"
        fields={documentInfoFields}
      />
      <ProfileSection title="Dirección" fields={addressInfoFields} />
      <ProfileSection title="Información de Pago" fields={paymentInfoFields} />
      <ProfileSection title="Configuraciones" fields={settingsFields} />
    </div>
  );
};

export default ProfileBody;

import React, { useState, useEffect } from "react";
import ProfileSection from "../../components/profileSection/ProfileSection";
import BankAccountsSection from "../../components/bankAccountSection/BankAccountSection";
import apiFetch from "../../utils/apiClient";
import Swal from "sweetalert2";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);

  const {
    user_id,
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
    { label: "Teléfono", value: indicative_code + " " + phone_number },
    { label: "Género", value: gender_name },
    { label: "Fecha de nacimiento", value: date_of_birth },
  ];

  const documentInfoFields = [
    { label: "Tipo de documento", value: document_type },
    { label: "Número de documento", value: document_number },
    { label: "Fecha de expedición", value: issue_date },
    { label: "Lugar de expedición", value: issue_city },
  ];

  const addressInfoFields = [
    { label: "País", value: country_name },
    { label: "Provincia", value: state_name },
    { label: "Ciudad", value: city_name },
    { label: "Dirección", value: address },
  ];

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/get_bank_account?user_id=${user_id}`);
        if (response.responseCode === 200) {
          setBankAccounts(response.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al cargar cuentas bancarias",
            text: response.description,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información bancaria.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [user_id]);

  const handleDeleteAccount = async () => {
    const confirmation = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminada, no podrás recuperar tu cuenta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      try {
        setLoading(true);
        const response = await apiFetch(`/delete_user?user_id=20`, {
          method: "DELETE",
        });

        if (response.responseCode === 200) {
          Swal.fire({
            icon: "success",
            title: "Cuenta eliminada",
            text: "Tu cuenta ha sido eliminada con éxito.",
          });
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar la cuenta",
            text: response.description,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar la cuenta",
          text: "Ha ocurrido un error al eliminar la cuenta.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const settingsFields = [
    {
      label: "Acciones",
      value: (
        <>
          <button className="action-btn">Editar Perfil</button>
          <button className="action-btn danger" onClick={handleDeleteAccount}>
            Eliminar Cuenta
          </button>
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
      <BankAccountsSection
        title="Información Bancaria"
        accounts={bankAccounts}
      />
      <ProfileSection title="Configuraciones" fields={settingsFields} />
    </div>
  );
};

export default ProfileBody;

import React, { useState, useEffect } from "react";
import ProfileSection from "../../components/profileSection/ProfileSection";
import BankAccountsSection from "../../components/bankAccountSection/BankAccountSection";
import apiFetch from "../../utils/apiClient";
import Swal from "sweetalert2";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    user_id: profileData.user_id,
    full_name: profileData.full_name,
    email: profileData.email,
    indicative_code: profileData.indicative_code,
    phone_number: profileData.phone_number,
    gender_name: profileData.gender_name,
    date_of_birth: profileData.date_of_birth,
    document_type: profileData.document_type,
    document_number: profileData.document_number,
    issue_date: profileData.issue_date,
    issue_city: profileData.issue_city,
    country_name: profileData.country_name,
    state_name: profileData.state_name,
    city_name: profileData.city_name,
    address: profileData.address,
  });

  const personalInfoFields = [
    { label: "Nombre", value: formData.full_name, name: "full_name" },
    { label: "Email", value: formData.email, name: "email" },
    {
      label: "Teléfono",
      value: formData.indicative_code + " " + formData.phone_number,
      name: "phone_number",
    },
    { label: "Género", value: formData.gender_name, name: "gender_name" },
    {
      label: "Fecha de nacimiento",
      value: formData.date_of_birth,
      name: "date_of_birth",
    },
  ];

  const documentInfoFields = [
    {
      label: "Tipo de documento",
      value: formData.document_type,
      name: "document_type",
    },
    {
      label: "Número de documento",
      value: formData.document_number,
      name: "document_number",
    },
    {
      label: "Fecha de expedición",
      value: formData.issue_date,
      name: "issue_date",
    },
    {
      label: "Lugar de expedición",
      value: formData.issue_city,
      name: "issue_city",
    },
  ];

  const addressInfoFields = [
    { label: "País", value: formData.country_name, name: "country_name" },
    { label: "Provincia", value: formData.state_name, name: "state_name" },
    { label: "Ciudad", value: formData.city_name, name: "city_name" },
    { label: "Dirección", value: formData.address, name: "address" },
  ];

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    console.log("Changes saved", formData);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(
          `/get_bank_account?user_id=${formData.user_id}`
        );
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
  }, [formData.user_id]);

  return (
    <div className="profile-body">
      <ProfileSection
        title="Información Personal"
        fields={personalInfoFields}
        isEditing={isEditing}
        handleChange={handleChange}
      />
      <ProfileSection
        title="Información del Documento"
        fields={documentInfoFields}
        isEditing={isEditing}
        handleChange={handleChange}
      />
      <ProfileSection
        title="Dirección"
        fields={addressInfoFields}
        isEditing={isEditing}
        handleChange={handleChange}
      />
      <BankAccountsSection
        title="Información Bancaria"
        accounts={bankAccounts}
        isEditing={isEditing}
      />
      <div className="settings-actions">
        {isEditing ? (
          <>
            <button className="action-btn" onClick={handleEditClick}>
              Cancelar Edición
            </button>
            <button className="action-btn success" onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          </>
        ) : (
          <>
            <button className="action-btn" onClick={handleEditClick}>
              Editar Perfil
            </button>
            <button className="action-btn danger" onClick={handleDeleteAccount}>
              Eliminar Cuenta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileBody;

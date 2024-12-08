import React, { useState, useEffect } from "react";
import ProfileSection from "../../components/profileSection/ProfileSection";
import Button from "../../components/button/Button";
import EditableListSection from "../editableListSection/EditableListSection";
import apiFetch from "../../utils/apiClient";
import { showAlert, formatDate } from "../../utils/generalTools";
import Swal from "sweetalert2";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    user_id: profileData.user_id,
    // full_name: profileData.full_name,
    email: profileData.email,
    phone_number: profileData.phone_number,
    gender_id: profileData.gender_id,
    gender_name: profileData.gender_name,
    date_of_birth: formatDate(profileData.date_of_birth),
    document_type: profileData.document_type,
    document_type_id: profileData.document_type_id,
    document_number: profileData.document_number,
    date_of_issue: formatDate(profileData.date_of_issue),
    state_of_issue: profileData.state_of_issue,
    city_of_issue: profileData.city_of_issue,
    state_of_issue_id: profileData.state_of_issue_id,
    city_of_issue_id: profileData.city_of_issue_id,
    state_name: profileData.state_name,
    city_name: profileData.city_name,
    address: profileData.address,
  });

  const personalInfoFields = [
    {
      label: "Email",
      type: "email",
      value: formData.email,
      name: "email",
      required: true,
    },
    {
      label: "Teléfono",
      type: "phone",
      value: formData.phone_number,
      name: "phone_number",
      required: true,
    },
    {
      label: "Género",
      type: "select",
      value: formData.gender_name,
      name: "gender_name",
      options: formData.gender_name,
      disabled: true,
    },
    {
      label: "Fecha de nacimiento",
      type: "date",
      value: formData.date_of_birth,
      name: "date_of_birth",
      disabled: true,
    },
  ];

  const documentInfoFields = [
    {
      label: "Tipo de documento",
      type: "select",
      value: formData.document_type,
      name: "document_type",
      options: formData.document_type,
      disabled: true,
    },
    {
      label: "Número de documento",
      type: "text",
      value: formData.document_number,
      name: "document_number",
      disabled: true,
    },
    {
      label: "Fecha de expedición",
      type: "date",
      value: formData.date_of_issue,
      name: "date_of_issue",
      disabled: true,
    },
    {
        label: "Departamento de expedición",
        type: "select",
        value: formData.state_of_issue,
        name: "state_of_issue",
        options: formData.state_of_issue,
        disabled: true,
    },
    {
        label: "Ciudad de expedición",
        type: "select",
        value: formData.city_of_issue,
        name: "city_of_issue",
        options: formData.city_of_issue,
        disabled: true,
    },
  ];

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
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
        const response = await apiFetch(
          `/delete_user?user_id=${formData.user_id}`,
          {
            method: "DELETE",
          }
        );

        if (response.responseCode === 200) {
          showAlert(
            "success",
            "Cuenta eliminada",
            "Tu cuenta ha sido eliminada con éxito."
          );
          window.location.href = "/";
        } else {
          showAlert(
            "error",
            "Error al eliminar la cuenta",
            "Ha ocurrido un error al eliminar la cuenta."
          );
        }
      } catch (error) {
        showAlert(
          "error",
          "Error al eliminar la cuenta",
          "Ha ocurrido un error al eliminar la cuenta."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/update_user", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.responseCode === 200) {
        showAlert(
          "success",
          "Información actualizada",
          "La información ha sido actualizada con éxito."
        );
      } else {
        showAlert(
          "error",
          "Error al actualizar la información",
          response.description
        );
      }
    } catch (error) {
      showAlert(
        "error",
        "Error al actualizar la información",
        "Ha ocurrido un error al actualizar la información."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bankAccountsResponse, addressesResponse] =
          await Promise.allSettled([
            apiFetch(`/get_bank_account?user_id=${formData.user_id}`),
            apiFetch(`/get_address?user_id=${formData.user_id}`),
          ]);

        if (
          bankAccountsResponse.status === "fulfilled" &&
          bankAccountsResponse.value.responseCode === 200
        ) {
          setBankAccounts(
            bankAccountsResponse.value.data.map((account) => ({
              id: account.bank_account_id,
              name: account.bank_name,
              type: account.account_type,
              accountNumber: account.account_number,
              primary: !!account.principal_account,
            }))
          );
        } else {
          setBankAccounts([]);
        }

        if (
          addressesResponse.status === "fulfilled" &&
          addressesResponse.value.responseCode === 200
        ) {
          setAddresses(
            addressesResponse.value.data.map((address) => ({
              id: address.address_id,
              address: address.address,
              state: address.state_name,
              city: address.city_name,
              primary: !!address.principal_address,
            }))
          );
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (formData.user_id) {
      fetchData();
    }
  }, [formData.user_id]);

  const createAddress = async (newAddressData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/create_address", {
        method: "POST",
        body: JSON.stringify(newAddressData),
      });

      if (response.responseCode === 200) {
        const newAddress = await response.json();
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
      } else {
        showAlert("error", "Error", "Error al crear la dirección.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId, updatedAddressData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/update_address/${addressId}`, {
        method: "PUT",
        body: JSON.stringify(updatedAddressData),
      });

      if (response.responseCode) {
        const updatedAddress = await response.json();
        setAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address.id === addressId ? updatedAddress : address
          )
        );
      } else {
        showAlert("error", "Error", "Error al actualizar la dirección.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete_address/${addressId}`, {
        method: "DELETE",
      });

      if (response.responseCode === 200) {
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address.id !== addressId)
        );
      } else {
        showAlert("error", "Error", "Error al eliminar la dirección.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const createBankAccount = async (newAccountData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/create_bank_account", {
        method: "POST",
        body: JSON.stringify(newAccountData),
      });

      if (response.responseCode === 200) {
        const newAccount = await response.json();
        setBankAccounts((prevAccounts) => [...prevAccounts, newAccount]);
      } else {
        showAlert("error", "Error", "Error al crear la cuenta bancaria.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const updateBankAccount = async (accountId, updatedAccountData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/update_bank_account/${accountId}`, {
        method: "PUT",
        body: JSON.stringify(updatedAccountData),
      });

      if (response.responseCode === 200) {
        const updatedAccount = await response.json();
        setBankAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.id === accountId ? updatedAccount : account
          )
        );
      } else {
        showAlert("error", "Error", "Error al actualizar la cuenta bancaria.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBankAccount = async (accountId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete_bank_account/${accountId}`, {
        method: "DELETE",
      });

      if (response.responseCode === 200) {
        setBankAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account.id !== accountId)
        );
      } else {
        showAlert("error", "Error", "Error al eliminar la cuenta bancaria.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrimary = (type, id) => {
    // console.log("Toggle primary:", type, id);

    if (type === "address") {
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === id
            ? { ...address, primary: true }
            : { ...address, primary: false }
        )
      );
    } else if (type === "bank") {
      setBankAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === id
            ? { ...account, primary: true }
            : { ...account, primary: false }
        )
      );
    }
  };

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
      <EditableListSection
        title="Direcciones"
        items={addresses}
        isEditing={isEditing}
        onAddItem={createAddress}
        onEditItem={updateAddress}
        onDeleteItem={deleteAddress}
        onTogglePrimary={handleTogglePrimary}
        type="address"
      />
      <EditableListSection
        title="Información Bancaria"
        items={bankAccounts}
        isEditing={isEditing}
        onAddItem={createBankAccount}
        onEditItem={updateBankAccount}
        onDeleteItem={deleteBankAccount}
        onTogglePrimary={handleTogglePrimary}
        type="bank"
      />
      <div className="settings-actions">
        {isEditing ? (
          <>
            <Button
              type="button"
              text="Cancelar edición"
              onClick={handleEditClick}
              styleType="cancel-btn"
            />
            <Button
              type="button"
              text="Guardar Cambios"
              onClick={handleSaveChanges}
              styleType="save-btn"
            />
          </>
        ) : (
          <>
            <Button
              type="button"
              text="Editar Perfil"
              onClick={handleEditClick}
              styleType="edit-btn"
            />
            <Button
              type="button"
              text="Eliminar Cuenta"
              onClick={handleDeleteAccount}
              styleType="delete-btn"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileBody;

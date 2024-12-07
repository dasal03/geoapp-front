import React, { useState, useEffect } from "react";
import ProfileSection from "../../components/profileSection/ProfileSection";
import Button from "../../components/button/Button";
import EditableListSection from "../editableListSection/EditableListSection";
import apiFetch from "../../utils/apiClient";
import { showAlert } from "../../utils/generalTools";
import Swal from "sweetalert2";
import "./ProfileBody.scss";

const ProfileBody = ({ profileData }) => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    user_id: profileData.user_id,
    full_name: profileData.full_name,
    email: profileData.email,
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
    {
      label: "Nombre",
      type: "text",
      value: formData.full_name,
      name: "full_name",
    },
    {
      label: "Email",
      type: "email",
      value: formData.email,
      name: "email",
    },
    {
      label: "Teléfono",
      type: "phone",
      value: formData.phone_number,
      name: "phone_number",
    },
    {
      label: "Género",
      type: "select",
      value: formData.gender_name,
      name: "gender_name",
    },
    {
      label: "Fecha de nacimiento",
      type: "date",
      value: formData.date_of_birth,
      name: "date_of_birth",
    },
  ];

  const documentInfoFields = [
    {
      label: "Tipo de documento",
      type: "select",
      value: formData.document_type,
      name: "document_type",
    },
    {
      label: "Número de documento",
      type: "text",
      value: formData.document_number,
      name: "document_number",
    },
    {
      label: "Fecha de expedición",
      type: "date",
      value: formData.issue_date,
      name: "issue_date",
    },
    {
      label: "Lugar de expedición",
      type: "text",
      value: formData.issue_city,
      name: "issue_city",
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
            <div className="action-btn">
              <Button
                type="button"
                text="Cancelar edición"
                onClick={handleEditClick}
              />
            </div>
            <div className="action-btn success">
              <Button
                type="button"
                text="Guardar Cambios"
                onClick={handleSaveChanges}
              />
            </div>
          </>
        ) : (
          <>
            <div className="action-btn">
              <Button
                type="button"
                text="Editar Perfil"
                onClick={handleEditClick}
              />
            </div>
            <div className="action-btn danger">
              <Button
                type="button"
                text="Eliminar Cuenta"
                onClick={handleDeleteAccount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileBody;

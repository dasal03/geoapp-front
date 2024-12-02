import React, { useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaTrashAlt, FaPlus } from "react-icons/fa";
import "./BankAccountSection.scss";

const BankAccountsSection = ({
  title,
  accounts = [],
  isEditing,
}) => {
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editedAccountData, setEditedAccountData] = useState({});
  const [newAccount, setNewAccount] = useState({
    bank_name: "",
    account_type: "",
    account_number: "",
    principal_account: false,
  });

  const handleInputChange = (e, field) => {
    setEditedAccountData({
      ...editedAccountData,
      [field]: e.target.value,
    });
  };

  const handleAddAccount = () => {
    // Aquí iría la lógica para agregar una nueva cuenta bancaria
  };

  const handleEdit = (accountId, accountData) => {
    // Aquí iría la lógica para editar una cuenta bancaria
  };

  const handleDelete = (accountId) => {
    // Aquí iría la lógica para eliminar una cuenta bancaria
  };

  const handleChange = (e, accountId) => {
    // Aquí iría la lógica para cambiar el estado de la cuenta bancaria
  };

  const toggleEditMode = (accountId, accountData) => {
    if (editingAccountId === accountId) {
      setEditingAccountId(null);
      handleEdit(accountId, editedAccountData);
    } else {
      setEditingAccountId(accountId);
      setEditedAccountData(accountData);
    }
  };

  const handleCancelEdit = () => {
    setEditingAccountId(null);
    setEditedAccountData({});
  };

  return (
    <div className="bank-accounts-section">
      <h2>{title}</h2>

      {isEditing && (
        <button className="add-account-btn" onClick={handleAddAccount}>
          <FaPlus /> Añadir nueva cuenta
        </button>
      )}

      {accounts.length > 0 ? (
        <ul>
          {accounts.map((account) => (
            <li key={account.bank_account_id} className="bank-account-item">
              <div className="account-info">
                <input
                  type="checkbox"
                  name="principal_account"
                  checked={account.principal_account === 1}
                  onChange={(e) => handleChange(e, account.bank_account_id)}
                  disabled={
                    !isEditing || editingAccountId !== account.bank_account_id
                  }
                />
                <p>
                  <strong>Banco: </strong>
                  {editingAccountId === account.bank_account_id ? (
                    <input
                      type="text"
                      value={editedAccountData.bank_name || account.bank_name}
                      onChange={(e) => handleInputChange(e, "bank_name")}
                    />
                  ) : (
                    account.bank_name
                  )}
                </p>
                <p>
                  <strong>Tipo de cuenta: </strong>
                  {editingAccountId === account.bank_account_id ? (
                    <input
                      type="text"
                      value={
                        editedAccountData.account_type || account.account_type
                      }
                      onChange={(e) => handleInputChange(e, "account_type")}
                    />
                  ) : (
                    account.account_type
                  )}
                </p>
                <p>
                  <strong>Número de cuenta: </strong>
                  {editingAccountId === account.bank_account_id ? (
                    <input
                      type="text"
                      value={
                        editedAccountData.account_number ||
                        account.account_number
                      }
                      onChange={(e) => handleInputChange(e, "account_number")}
                    />
                  ) : (
                    account.account_number
                  )}
                </p>
              </div>

              {isEditing && (
                <div className="account-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      toggleEditMode(account.bank_account_id, account)
                    }
                  >
                    {editingAccountId === account.bank_account_id ? (
                      <FaCheck />
                    ) : (
                      <FaEdit />
                    )}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={
                      editingAccountId === account.bank_account_id
                        ? handleCancelEdit
                        : () => handleDelete(account.bank_account_id)
                    }
                  >
                    {editingAccountId === account.bank_account_id ? (
                      <FaTimes />
                    ) : (
                      <FaTrashAlt />
                    )}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay información bancaria disponible.</p>
      )}
    </div>
  );
};

export default BankAccountsSection;

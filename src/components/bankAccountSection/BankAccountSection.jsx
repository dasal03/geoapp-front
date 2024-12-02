import React from "react";
import "./BankAccountSection.scss";

const BankAccountsSection = ({ title, accounts = [] }) => {
  return (
    <div className="bank-accounts-section">
      <h2>{title}</h2>
      {accounts.length > 0 ? (
        <ul>
          {accounts.map((account) => (
            <li key={account.bank_account_id} className="bank-account-item">
              <input
                type="radio"
                name="principal_account"
                checked={account.principal_account === 1}
              />
              <p>
                <strong>Banco:</strong> {account.bank_name}
              </p>
              <p>
                <strong>Tipo de cuenta:</strong> {account.account_type}
              </p>
              <p>
                <strong>Número de cuenta:</strong> {account.account_number}
              </p>
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

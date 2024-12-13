import React, { useState } from "react";
import InputField from "../inputField/InputField";
import SelectField from "../selectField/SelectField";
import Button from "../button/Button";
import "./EditableListSection.scss";

const EditableListSection = ({
  title,
  items = [],
  isEditing,
  type,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onTogglePrimary,
}) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});

  const handleInputChange = (e, field) => {
    setEditedItemData({
      ...editedItemData,
      [field]: e.target.value,
    });
  };

  const handleAddItem = () => {
    onAddItem();
  };

  const handleEdit = (itemId, itemData) => {
    onEditItem(itemId, itemData);
  };

  const handleDelete = (itemId) => {
    onDeleteItem(itemId);
  };

  

  const toggleEditMode = (itemId, itemData) => {
    if (editingItemId === itemId) {
      setEditingItemId(null);
      handleEdit(itemId, editedItemData);
    } else {
      setEditingItemId(itemId);
      setEditedItemData(itemData);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedItemData({});
  };

  return (
    <div className="editable-list-section">
      <h2>{title}</h2>

      {isEditing && (
        <Button
          type="button"
          text={`Añadir ${type === "bank" ? "cuenta bancaria" : "dirección"}`}
          icon="fa fa-plus"
          onClick={handleAddItem}
          styleType="add-item-btn"
        />
      )}

      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="editable-item">
              <div className="item-info">
                <input
                  type="checkbox"
                  name="primary"
                  checked={item.primary}
                  onChange={() => onTogglePrimary(type, item.id)}
                  disabled={!isEditing}
                />

                {type === "bank" ? (
                  <>
                    <p>
                      <strong>Banco: </strong>
                      {editingItemId === item.id ? (
                        <SelectField
                          label="Seleccione un banco"
                          id={"bank"}
                          name="bank"
                          value={editedItemData.bank || item.bank}
                          onChange={(e) => handleInputChange(e, "bank")}
                          options={[
                            { id: "Banco A", name: "Banco A" },
                            { id: "Banco B", name: "Banco B" },
                            { id: "Banco C", name: "Banco C" },
                          ]}
                        />
                      ) : (
                        item.name
                      )}
                    </p>
                    <p>
                      <strong>Tipo de cuenta: </strong>
                      {editingItemId === item.id ? (
                        <SelectField
                          label="Seleccione un tipo de cuenta"
                          id={"type"}
                          name="type"
                          value={editedItemData.type || item.type}
                          onChange={(e) => handleInputChange(e, "type")}
                          options={[
                            { id: "Ahorros", name: "Ahorros" },
                            { id: "Corriente", name: "Corriente" },
                          ]}
                        />
                      ) : (
                        item.type
                      )}
                    </p>
                    <p>
                      <strong>Número de cuenta: </strong>
                      {editingItemId === item.id ? (
                        <InputField
                          label="Número de cuenta"
                          type="text"
                          placeholder="Numero de cuenta"
                          value={
                            editedItemData.accountNumber || item.accountNumber
                          }
                          onChange={(e) =>
                            handleInputChange(e, "accountNumber")
                          }
                          required="true"
                          styleType="default"
                        />
                      ) : (
                        item.accountNumber
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Departamento: </strong>
                      {editingItemId === item.id ? (
                        <SelectField
                          label="Seleccione un departamento"
                          id={"state"}
                          name="state"
                          value={editedItemData.state || item.state}
                          onChange={(e) => handleInputChange(e, "state")}
                          options={[
                            { id: "Departamento A", name: "Departamento A" },
                            { id: "Departamento B", name: "Departamento B" },
                            { id: "Departamento C", name: "Departamento C" },
                          ]}
                        />
                      ) : (
                        item.state
                      )}
                    </p>
                    <p>
                      <strong>Ciudad: </strong>
                      {editingItemId === item.id ? (
                        <SelectField
                          label="Seleccione una ciudad"
                          id={"city"}
                          name="city"
                          value={editedItemData.city || item.city}
                          onChange={(e) => handleInputChange(e, "city")}
                          options={[
                            { id: "Ciudad A", name: "Ciudad A" },
                            { id: "Ciudad B", name: "Ciudad B" },
                            { id: "Ciudad C", name: "Ciudad C" },
                          ]}
                        />
                      ) : (
                        item.city
                      )}
                    </p>
                    <p>
                      <strong>Dirección: </strong>
                      {editingItemId === item.id ? (
                        <InputField
                          type="text"
                          placeholder="Dirección"
                          value={editedItemData.address || item.address}
                          onChange={(e) => handleInputChange(e, "address")}
                        />
                      ) : (
                        item.address
                      )}
                    </p>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="item-actions">
                  <Button
                    type="button"
                    text={editingItemId === item.id ? "Guardar" : "Editar"}
                    icon={
                      editingItemId === item.id ? "fa fa-check" : "fa fa-edit"
                    }
                    onClick={() => toggleEditMode(item.id, item)}
                    styleType={
                      editingItemId === item.id
                        ? "card-save-btn"
                        : "card-edit-btn"
                    }
                    hideText="true"
                  />
                  <Button
                    type="button"
                    text={editingItemId === item.id ? "Cancelar" : "Eliminar"}
                    icon={
                      editingItemId === item.id
                        ? "fa fa-times"
                        : "fa fa-trash-alt"
                    }
                    onClick={
                      editingItemId === item.id
                        ? handleCancelEdit
                        : () => handleDelete(item.id)
                    }
                    styleType={
                      editingItemId === item.id
                        ? "card-cancel-btn"
                        : "card-delete-btn"
                    }
                    hideText="true"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No hay {type === "bank" ? "cuentas bancarias" : "direcciones"}{" "}
          disponibles.
        </p>
      )}
    </div>
  );
};

export default EditableListSection;

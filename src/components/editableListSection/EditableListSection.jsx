import React, { useState } from "react";
// import apiFetch from "../../utils/apiClient";
import { FaEdit, FaCheck, FaTimes, FaTrashAlt, FaPlus } from "react-icons/fa";
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

  const handleChangePrimary = (e, itemId) => {
    onTogglePrimary(e, itemId);
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
        <button className="add-item-btn" onClick={handleAddItem}>
          <FaPlus /> Añadir {type === "bank" ? "cuenta bancaria" : "dirección"}
        </button>
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
                  onChange={(e) => handleChangePrimary(e, item.id)}
                  disabled={!isEditing || editingItemId !== item.id}
                />

                {type === "bank" ? (
                  <>
                    <p>
                      <strong>Banco: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItemData.name || item.name}
                          onChange={(e) => handleInputChange(e, "name")}
                        />
                      ) : (
                        item.name
                      )}
                    </p>
                    <p>
                      <strong>Tipo de cuenta: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItemData.type || item.type}
                          onChange={(e) => handleInputChange(e, "type")}
                        />
                      ) : (
                        item.type
                      )}
                    </p>
                    <p>
                      <strong>Número de cuenta: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={
                            editedItemData.accountNumber || item.accountNumber
                          }
                          onChange={(e) =>
                            handleInputChange(e, "accountNumber")
                          }
                        />
                      ) : (
                        item.accountNumber
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>País: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItemData.country || item.country}
                          onChange={(e) => handleInputChange(e, "country")}
                        />
                      ) : (
                        item.country
                      )}
                    </p>
                    <p>
                      <strong>Estado: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItemData.state || item.state}
                          onChange={(e) => handleInputChange(e, "state")}
                        />
                      ) : (
                        item.state
                      )}
                    </p>
                    <p>
                      <strong>Ciudad: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItemData.city || item.city}
                          onChange={(e) => handleInputChange(e, "city")}
                        />
                      ) : (
                        item.city
                      )}
                    </p>
                    <p>
                      <strong>Dirección: </strong>
                      {editingItemId === item.id ? (
                        <input
                          type="text"
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
                  <button
                    className="edit-btn"
                    onClick={() => toggleEditMode(item.id, item)}
                  >
                    {editingItemId === item.id ? <FaCheck /> : <FaEdit />}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={
                      editingItemId === item.id
                        ? handleCancelEdit
                        : () => handleDelete(item.id)
                    }
                  >
                    {editingItemId === item.id ? <FaTimes /> : <FaTrashAlt />}
                  </button>
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

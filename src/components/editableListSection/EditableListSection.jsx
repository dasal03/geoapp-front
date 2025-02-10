import { memo, useState } from "react";
import InputField from "../ui/inputField/InputField";
import Button from "../ui/button/Button";
import SectionActions from "../sectionActions/SectionActions";
import DynamicModal from "../modals/DynamicModal";
import "./EditableListSection.scss";

const EditableListSection = memo(
  ({
    title,
    sectionData = [],
    sectionConfig = [],
    onCheckChange,
    onAddItem,
    onEditItem,
    onDeleteItem,
    userId,
  }) => {
    const [loadingItems, setLoadingItems] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCheckChange = async (item, newValue) => {
      setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
      await onCheckChange?.(item, newValue);
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    };

    const openModal = (item = null) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    };

    const handleSave = (newData) => {
      if (selectedItem) {
        onEditItem?.({ ...selectedItem, ...newData });
      } else {
        onAddItem?.(newData);
      }
      setIsModalOpen(false);
    };

    return (
      <section className="editable-list-section">
        <h3 className="section-title">{title}</h3>
        <div className="section-fields">
          {sectionData && sectionData.length ? (
            sectionData.map((item) => (
              <div key={item.id || item.name} className="editable-item">
                {loadingItems[item.id] && (
                  <div className="spinner-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
                <InputField
                  type="checkbox"
                  name="principal"
                  checked={item.is_principal}
                  onChange={() => handleCheckChange(item, !item.is_principal)}
                  styleType="item-checkbox"
                />
                <div className="item-info">
                  {sectionConfig.map((field) => (
                    <p key={field.name}>
                      <strong>{field.label}:</strong> {item[field.name]}
                    </p>
                  ))}
                </div>
                <SectionActions
                  isEditing={false}
                  onEdit={() => openModal(item)}
                  onDelete={() => onDeleteItem?.(item)}
                  hideText
                />
              </div>
            ))
          ) : (
            <p className="no-data">No hay {title} vinculadas.</p>
          )}
          <Button
            type="button"
            text={`Agregar ${title}`}
            icon="fa fa-plus"
            onClick={() => openModal()}
            styleType="add-item-btn"
          />
        </div>

        <DynamicModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedItem}
          onSave={handleSave}
          fields={sectionConfig}
          title={selectedItem ? `Editar ${title}` : `Añadir ${title}`}
          userId={userId}
        />
      </section>
    );
  }
);

export default EditableListSection;

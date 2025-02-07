import { memo, useState } from "react";
import InputField from "../ui/inputField/InputField";
import Button from "../ui/button/Button";
import SectionActions from "../sectionActions/SectionActions";
import "./EditableListSection.scss";

const EditableListSection = memo(
  ({
    title,
    sectionData = [],
    sectionConfig = [],
    onCheckChange,
    onEditItem,
    onDeleteItem,
    handleAddItem,
  }) => {
    const [loading, setLoading] = useState(false);

    const handleCheckChange = async (item, newValue) => {
      setLoading(true);
      await onCheckChange?.(item, newValue);
      setLoading(false);
    };

    return (
      <section className="editable-list-section">
        {loading && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <h3 className="section-title">{title}</h3>
        <div className="section-fields">
          {sectionData.length > 0 ? (
            sectionData.map((item) => (
              <div key={item.id || item.name} className="editable-item">
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
                  onEdit={() => onEditItem?.(item)}
                  onDelete={() => onDeleteItem?.(item)}
                  hideText
                />
              </div>
            ))
          ) : (
            <p className="no-data">No hay datos disponibles.</p>
          )}
          <Button
            type="button"
            text={`Añadir ${title}`}
            icon="fa fa-plus"
            onClick={handleAddItem}
            styleType="add-item-btn"
          />
        </div>
      </section>
    );
  }
);

export default EditableListSection;

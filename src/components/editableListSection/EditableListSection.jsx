import { memo, useState, useCallback } from "react";
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
    onAddItem,
    onEditItem,
    onDeleteItem,
  }) => {
    const [loadingItems, setLoadingItems] = useState({});

    const handleCheckChange = useCallback(
      async (item, newValue) => {
        setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
        await onCheckChange?.(item, newValue);
        setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
      },
      [onCheckChange]
    );

    return (
      <section
        className={`editable-list-section ${
          sectionData.length > 0 ? "has-items" : "empty"
        }`}
      >
        <h3 className="section-title">{title}</h3>
        <div className="section-fields">
          {sectionData.length > 0 ? (
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
                  {sectionConfig
                    ?.filter((field) => field.isVisible !== false)
                    ?.map((field) => (
                      <p key={field.name}>
                        <strong>{field.label}:</strong> {item[field.name]}
                      </p>
                    ))}
                </div>
                <SectionActions
                  onEdit={() => onEditItem?.(item)}
                  onDelete={() => onDeleteItem?.(item.id)}
                  hideText
                />
              </div>
            ))
          ) : (
            <p className="no-data">No hay {title} vinculadas.</p>
          )}
          <Button
            text={`Agregar ${title}`}
            icon="fa fa-plus"
            onClick={() => onAddItem?.()}
            styleType="add-item-btn"
          />
        </div>
      </section>
    );
  }
);

export default EditableListSection;

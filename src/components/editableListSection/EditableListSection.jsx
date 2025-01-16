import { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import ModalForm from "../ui/modal/ModalForm";
import Loader from "../loading/LoadingSpinner";
import SectionActions from "../sectionActions/SectionActions";
import "./EditableListSection.scss";

const EditableListSection = ({
  title,
  sectionData = [],
  sectionConfig,
  loading = false,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (!isModalOpen) {
      setChangedFields({});
    }
  }, [isModalOpen]);

  const handleEditClick = (item) => {
    setFormValues(item);
    setIsModalOpen(true);
  };

  const handleCancelClick = () => {
    setFormValues({});
    setIsModalOpen(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
    setChangedFields((prevChanges) => ({
      ...prevChanges,
      [fieldName]: true,
    }));
  };

  const handleSaveClick = () => {
    if (onEditItem && Object.keys(changedFields).length > 0) {
      onEditItem(formValues);
    }
    setIsModalOpen(false);
    setChangedFields({});
  };

  return (
    <section className="editable-list-section">
      <h3 className="section-title">{title}</h3>
      <div className="section-fields">
        {sectionData.map((item) => (
          <div key={item.id || item.name} className="editable-item">
            <div className="item-info">
              {sectionConfig.map((field) => (
                <p key={field.name}>
                  <strong>{field.label}:</strong> {item[field.name]}
                </p>
              ))}
            </div>
            <SectionActions
              isEditing={false}
              onEdit={() => handleEditClick(item)}
              onDelete={() => onDeleteItem && onDeleteItem(item)}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        text={`Añadir ${title}`}
        icon="fa fa-plus"
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        styleType="add-item-btn"
      />
      {loading && <Loader />}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        title={`Editar ${title}`}
        formValues={formValues}
        sectionConfig={sectionConfig}
        onChange={handleInputChange}
        onSave={handleSaveClick}
        onCancel={handleCancelClick}
      />
    </section>
  );
};

export default EditableListSection;

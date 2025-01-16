import Modal from "../modal/Modal";
import InputField from "../../ui/inputField/InputField";
import SelectField from "../../ui/selectField/SelectField";
import SectionActions from "../../sectionActions/SectionActions";
import "./ModalForm.scss";

const ModalForm = ({
  isOpen,
  onClose,
  title,
  formValues,
  sectionConfig,
  onChange,
  onSave,
  onCancel,
}) => {
  const hasChanges = Object.keys(formValues).length > 0;

  const renderField = (field) => {
    const value =
      formValues && formValues[field.name] !== undefined
        ? formValues[field.name]
        : "";

    const commonProps = {
      label: field.label,
      value,
      placeholder: field.placeholder,
      name: field.name,
      onChange: (e) => {
        onChange(field.name, e.target.value);
      },
    };

    switch (field.type) {
      case "text":
      case "email":
        return <InputField {...commonProps} />;
      case "select":
        return <SelectField {...commonProps} options={field.options} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="modal-form">
        {sectionConfig.map((field, index) => (
          <div key={index} className="form-field">
            {renderField(field)}
          </div>
        ))}
        <SectionActions
          isEditing={true}
          onSave={hasChanges ? onSave : null}
          onCancel={onCancel}
        />
      </div>
    </Modal>
  );
};

export default ModalForm;

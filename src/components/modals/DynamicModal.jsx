import { useState, useEffect } from "react";
import {
  PhoneField,
  InputField,
  SelectField,
  DateInputField,
  TextAreaField,
} from "../ui";
import { motion } from "framer-motion";
import "./DynamicModal.scss";

const DynamicModal = ({ open, onClose, data = {}, onSave, fields, title }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const initialData = fields.reduce((acc, field) => {
        acc[field.name] = data?.[field.name] ?? "";
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [open, data, fields]);

  const handleChange = (field, eventOrValue) => {
    const value = eventOrValue?.target?.value ?? eventOrValue ?? "";
    setFormData((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const validateFields = () => {
    const newErrors = fields.reduce(
      (acc, { name, required, minLength, maxLength }) => {
        const value = formData[name]?.toString().trim() ?? "";

        if (required && !value) {
          acc[name] = "Campo requerido";
        } else {
          if (minLength && value.length < minLength) {
            acc[name] = `Mínimo ${minLength} caracteres`;
          }
          if (maxLength && value.length > maxLength) {
            acc[name] = `Máximo ${maxLength} caracteres`;
          }
        }
        return acc;
      },
      {}
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;
    onSave(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="modal-container"
      >
        <h2>{title}</h2>
        <div className="form-grid">
          {fields.map(
            ({
              name,
              label,
              type,
              placeholder,
              options,
              required,
              disabled,
            }) => {
              const commonProps = {
                name,
                value: formData[name] ?? "",
                label,
                onChange: (e) => handleChange(name, e),
                required,
                disabled,
                styleType: `form-${type}`,
              };

              return (
                <div key={name} className="input-group">
                  {type === "select" ? (
                    <SelectField {...commonProps} options={options || []} />
                  ) : type === "date" ? (
                    <DateInputField {...commonProps} />
                  ) : type === "phone" ? (
                    <PhoneField {...commonProps} />
                  ) : type === "textarea" ? (
                    <TextAreaField {...commonProps} />
                  ) : (
                    <InputField
                      type={type}
                      placeholder={placeholder}
                      {...commonProps}
                    />
                  )}
                  {errors[name] && (
                    <span className="error">{errors[name]}</span>
                  )}
                </div>
              );
            }
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="save-btn">
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DynamicModal;

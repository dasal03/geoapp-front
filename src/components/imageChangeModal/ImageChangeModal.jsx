import { createPortal } from "react-dom";
import { Button } from "../ui";
import "./ImageChangeModal.scss";

const ImageChangeModal = ({
  isOpen,
  image,
  onClose,
  onDelete,
  onUpload,
  canDelete,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <Button
          aria-label="Cerrar"
          icon="fa fa-times"
          onClick={onClose}
          styleType="close-button"
        />

        <div className="modal-header">
          <h3 className="modal-title">Editar Imagen</h3>
        </div>

        <img src={image} alt="Imagen actual" className="preview-image" />

        <div className="modal-actions">
          <Button
            text="Cambiar"
            icon="fa fa-upload"
            onClick={onUpload}
            styleType="success-button"
          />
          <Button
            text="Eliminar"
            icon="fa fa-trash"
            onClick={onDelete}
            disabled={!canDelete}
            styleType="danger-button"
          />
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ImageChangeModal;

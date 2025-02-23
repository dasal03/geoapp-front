import { createPortal } from "react-dom";
import Button from "../ui/button/Button";
import "./ImageChangeModal.scss";

const ImageChangeModal = ({ isOpen, image, onClose, onDelete, onUpload }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Imagen</h3>
        <img src={image} alt="Imagen actual" className="preview-image" />
        <div className="modal-actions">
          <Button
            text="Eliminar"
            icon="fa fa-trash"
            onClick={onDelete}
            disabled={!image}
          />
          <Button text="Cambiar" icon="fa fa-upload" onClick={onUpload} />
        </div>
        <Button text="Cancelar" onClick={onClose} styleType="close-modal" />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ImageChangeModal;

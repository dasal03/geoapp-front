import { FaTimes } from "react-icons/fa";
import "./ImageOptionsModal.scss";

const ImageOptionsModal = ({
  image,
  onChangeImage,
  onDeleteImage,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content options-modal">
        <span className="close-modal" onClick={onClose}>
          <FaTimes />
        </span>
        <div className="modal-body">
          <img src={image} alt="Vista previa" className="modal-preview" />
          <div className="modal-buttons">
            <button onClick={onChangeImage}>Cambiar imagen</button>
            <button onClick={onDeleteImage}>Eliminar imagen</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOptionsModal;

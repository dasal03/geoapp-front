import Cropper from "react-easy-crop";
import "./ImageCropperModal.scss";

const ImageCropperModal = ({
  cropImage,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSaveCrop,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="crop-container">
          <Cropper
            image={cropImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onSaveCrop}>Seleccionar</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;

import { useState } from "react";
import { createPortal } from "react-dom";
import { getCroppedImg } from "../../utils/generalTools";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import "./ImageCropperModal.scss";

const ImageCropperModal = ({ cropImage, onSaveCrop, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
      onSaveCrop(croppedImage);
    } catch (error) {
      console.error(error);
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="cropper-container">
          <Cropper
            key={cropImage}
            image={cropImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="slider-container">
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>

        <div className="buttons-container">
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ImageCropperModal;

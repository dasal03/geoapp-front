import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Cropper from "react-easy-crop";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import { convertImageToBase64, getCroppedImg } from "../../utils/generalTools";
import "./ProfileImage.scss";

const ProfileImage = ({
  profile_image,
  onSaveImage,
  onDeleteImage,
  imageId,
}) => {
  const [image, setImage] = useState(profile_image || placeholderProfileImage);
  const [cropImage, setCropImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await convertImageToBase64(file);
      setCropImage(base64Image);
      setIsCropping(true);
      setIsOptionsOpen(false);
    }
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
      setImage(croppedImage);
      onSaveImage(croppedImage);
      setIsCropping(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async () => {
    if (image !== placeholderProfileImage) {
      if (imageId) {
        await onDeleteImage(imageId);
      }
      setImage(placeholderProfileImage);
      onSaveImage(null);
      setIsOptionsOpen(false);
    }
  };

  const openFileSelector = () => {
    document.querySelector('input[type="file"]').click();
  };

  const openOptionsModal = () => {
    if (image !== placeholderProfileImage) {
      setIsOptionsOpen(true);
    } else {
      openFileSelector();
    }
  };

  return (
    <div className="profile-image">
      <img src={image} alt="Imagen de perfil" />
      <label className="edit-icon" onClick={openOptionsModal}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <FaEdit />
      </label>

      {isOptionsOpen && (
        <div className="modal-overlay">
          <div className="modal-content options-modal">
            <span
              className="close-modal"
              onClick={() => setIsOptionsOpen(false)}
            >
              &times;
            </span>
            <div className="modal-body">
              <img src={image} alt="Vista previa" className="modal-preview" />
              <div className="modal-buttons">
                <button onClick={openFileSelector}>Cambiar imagen</button>
                <button onClick={handleDeleteImage}>Eliminar imagen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCropping && (
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
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setIsCropping(false)}>Cancelar</button>
              <button onClick={handleSaveCrop}>Seleccionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;

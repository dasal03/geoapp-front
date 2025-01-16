import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import { convertImageToBase64, getCroppedImg } from "../../utils/generalTools";
import ImageOptionsModal from "../imageOptionsModal/ImageOptionsModal";
import ImageCropperModal from "../imageCropperModal/ImageCropperModal";
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
        <ImageOptionsModal
          image={image}
          onChangeImage={openFileSelector}
          onDeleteImage={handleDeleteImage}
          onClose={() => setIsOptionsOpen(false)}
        />
      )}

      {isCropping && (
        <ImageCropperModal
          cropImage={cropImage}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          onClose={() => setIsCropping(false)}
          onSaveCrop={handleSaveCrop}
        />
      )}
    </div>
  );
};

export default ProfileImage;

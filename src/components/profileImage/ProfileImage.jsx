import { useState, useEffect, useRef } from "react";
import { convertImageToBase64 } from "../../utils/generalTools";
import ImageChangeModal from "../imageChangeModal/ImageChangeModal";
import ImageCropperModal from "../imageCropperModal/ImageCropperModal";
import { FaEdit } from "react-icons/fa";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import "./ProfileImage.scss";

const ProfileImage = ({ profileImage, onSaveImage }) => {
  const [image, setImage] = useState(profileImage || placeholderProfileImage);
  const [cropImage, setCropImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (cropImage) {
      setIsCropping(true);
      setIsModalOpen(false);
    }
  }, [cropImage]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64Image = await convertImageToBase64(file);
      setCropImage(base64Image);
    } catch (error) {
      console.error("Error al convertir imagen:", error);
    }

    e.target.value = "";
  };

  const handleSaveCrop = (croppedImage) => {
    setImage(croppedImage);
    onSaveImage(croppedImage);
    setIsCropping(false);
  };

  const handleDeleteImage = () => {
    setImage(placeholderProfileImage);
    onSaveImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="profile-image">
      <img src={image} alt="Imagen de perfil" />
      <label className="edit-icon" onClick={() => setIsModalOpen(true)}>
        <FaEdit />
      </label>

      <ImageChangeModal
        isOpen={isModalOpen}
        image={image}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteImage}
        onUpload={() => fileInputRef.current.click()}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {isCropping && cropImage && (
        <ImageCropperModal
          cropImage={cropImage}
          onSaveCrop={handleSaveCrop}
          onClose={() => setIsCropping(false)}
        />
      )}
    </div>
  );
};

export default ProfileImage;

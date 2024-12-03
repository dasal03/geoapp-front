import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import { convertImageToBase64, base64ToImage } from "../../utils/generalTools";
import "./ProfileImage.scss";

const ProfileImage = ({ profile_image, onSaveImage }) => {
  const [image, setImage] = useState(profile_image || placeholderProfileImage);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertImageToBase64(file);
        setImage(base64Image);

        const imageFile = await base64ToImage(base64Image, file.name);

        onSaveImage(imageFile);
      } catch (error) {
        console.error("Error al manejar la imagen:", error);
      }
    }
  };

  return (
    <div className="profile-image">
      <img src={image} alt="Imagen de perfil" />
      <label className="edit-icon">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <FaEdit />
      </label>
    </div>
  );
};

export default ProfileImage;

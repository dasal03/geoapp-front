import React from "react";
import placeholderProfileImage from "../../assets/profile-placeholder.jpg";
import "./ProfileImage.scss";

const ProfileImage = ({ profile_image }) => {
  return (
    <div className="profile-image">
      <img
        src={profile_image || placeholderProfileImage}
        alt="Imagen de perfil"
      />
    </div>
  );
};

export default ProfileImage;

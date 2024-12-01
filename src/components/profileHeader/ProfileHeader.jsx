import React from "react";
import ProfileImage from "../profileImage/ProfileImage";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData }) => {
  const { full_name, username, created_at, profile_image } = profileData;

  return (
    <div className="profile-header">
      <ProfileImage profile_image={profile_image} />
      <div className="profile-info">
        <h1>{full_name}</h1>
        <p><span className="username-decorator">@</span> {username}</p>
        <p>Miembro desde: {created_at}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;

import React from "react";
import ProfileImage from "../profileImage/ProfileImage";
import { formatDate } from "../../utils/generalTools";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData }) => {
  const { full_name, username, created_at, profile_img } = profileData;

  return (
    <div className="profile-header">
      <ProfileImage profile_image={profile_img} />
      <div className="profile-info">
        <h1>{full_name}</h1>
        <p><span className="username-decorator">@</span> {username}</p>
        <p>Miembro desde: {formatDate(created_at)}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;

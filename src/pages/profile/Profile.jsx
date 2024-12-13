import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import ProfileHeader from "../../components/profileHeader/ProfileHeader";
import ProfileBody from "../../components/profileBody/ProfileBody";
import useProfileData from "../../hooks/UseProfileData";
import "./Profile.scss";

const Profile = () => {
  const { user: authUser } = useAuth();
  const { profileData, loading, error } = useProfileData(authUser?.user_id);

  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <div className="profile-container">
      <ProfileHeader
        profileData={profileData}
        toggleEditMode={toggleEditMode}
        isEditing={isEditing}
      />
      <ProfileBody profileData={profileData} isEditing={isEditing} />
    </div>
  );
};

export default Profile;

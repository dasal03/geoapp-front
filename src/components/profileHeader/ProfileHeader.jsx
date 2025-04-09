import PropTypes from "prop-types";
import { formatDate } from "../../utils/generalTools";
import ProfileImage from "../profileImage/ProfileImage";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData, handleSave, loading }) => {
  if (loading || !profileData) {
    return (
      <div className="profile-header skeleton">
        <div className="skeleton-avatar" />
        <div className="profile-info">
          <div className="skeleton-line skeleton-line--name" />
          <div className="skeleton-line skeleton-line--username" />
          <div className="skeleton-line skeleton-line--date" />
        </div>
      </div>
    );
  }

  const {
    profile_image: profileImage,
    full_name: fullName,
    username: userName,
    created_at: createdAt,
  } = profileData;

  return (
    <div className="profile-header">
      <ProfileImage
        profileImage={profileImage}
        onSave={handleSave}
        loading={loading}
      />

      <div className="profile-info">
        <h1 className="profile-name">{fullName}</h1>
        <p className="profile-username">
          <span className="username-decorator">@</span>
          {userName}
        </p>
        <p className="profile-member-date">
          Miembro desde: {formatDate(createdAt)}
        </p>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  profileData: PropTypes.shape({
    profile_image: PropTypes.string,
    full_name: PropTypes.string,
    username: PropTypes.string,
    created_at: PropTypes.string,
  }),
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ProfileHeader;

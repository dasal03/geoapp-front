import PropTypes from "prop-types";
import ProfileImage from "../profileImage/ProfileImage";
import { formatDate } from "../../utils/generalTools";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData, handleChange }) => {
  const profileImage = profileData?.profile_image || null;
  const fullName = profileData?.full_name || "N/A";
  const username = profileData?.username || "N/A";
  const createdAt = profileData?.created_at || null;

  return (
    <div className="profile-header">
      <ProfileImage
        profileImage={profileImage}
        onSaveImage={(value) => handleChange("profile_image", value)}
      />

      <div className="profile-info">
        <h1 className="profile-name">{fullName}</h1>
        <p className="profile-username">
          <span className="username-decorator">@</span>
          {username}
        </p>
        <p className="profile-member-date">
          Miembro desde: {createdAt ? formatDate(createdAt) : "N/A"}
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
  handleChange: PropTypes.func.isRequired,
};

export default ProfileHeader;

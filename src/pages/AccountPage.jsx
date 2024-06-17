import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetInfo, useUserProfile } from "../hooks/useQueryHooks";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import "./PageStyles/PageStyles.css";

const AccountPage = () => {
  const navigate = useNavigate();
  const { authInfo } = useContext(AuthenticationContext);
  const { data: userData, isLoading: isUserLoading } = useUserProfile(
    authInfo.userId,
    authInfo.csrfToken,
    authInfo.sessionId
  );

  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (userData?.id) {
      setProfileId(userData.id);
    }
  }, [userData]);

  const { data: availabilityData, isLoading: isAvailabilityLoading } =
    useGetInfo(
      profileId
        ? `http://127.0.0.1:8000/availability/availability/user/${profileId}/`
        : null
    );

  const orgInfo = availabilityData ? availabilityData[0] : null;

  const handleNavigateToAvailabilityForm = () => {
    navigate("/availability-edit-form", {
      state: { userProfileId: userData?.id },
    });
  };

  const handleNavigateSettingsForm = () => {
    navigate("/settings", {
      state: { userProfileId: userData?.id },
    });
  };

  const handleNavigateHomeForm = () => {
    navigate("/", {
      state: { userProfileId: userData?.id },
    });
  };

  if (isUserLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="user-info-container">
      <div className="user-info-wrapper">
        <h1 className="user-info-heading">Welcome</h1>
        <h1 className="user-info-username">
          {userData ? userData.user_name : "Loading..."}
        </h1>
        <div className="general-info-container">
          <div className="weekend-status-container">
            <h3 className="user-info-h3">Weekend Status:</h3>
            <span className="user-info-span">
              {isAvailabilityLoading
                ? "Loading availability..."
                : orgInfo
                ? orgInfo.exclude_weekends
                  ? "Your organisation does not work weekends"
                  : "Your organisation works weekends"
                : "Edit Organisation"}
            </span>
          </div>
          <h3 className="user-info-h3">Services Offered:</h3>
          <span className="user-info-span">
            {isAvailabilityLoading
              ? "Loading services..."
              : orgInfo
              ? orgInfo.service_offered
              : "..."}
          </span>
          <h3 className="user-info-h3">Working Hours:</h3>
          <span className="user-info-span">
            {isAvailabilityLoading
              ? "Loading hours..."
              : orgInfo
              ? `${orgInfo?.start_hour} - ${orgInfo?.end_hour}`
              : "edit info"}
          </span>
          <h3 className="user-info-h3">Location:</h3>
          <span className="user-info-span">
            {isAvailabilityLoading
              ? "Loading location..."
              : orgInfo
              ? orgInfo.location
              : "Edit Location"}
          </span>
        </div>
      </div>
      <div className="user-button-container">
        <button
          className="user-info-org-button"
          onClick={handleNavigateToAvailabilityForm}
        >
          Edit Organisation
        </button>
        <button
          className="user-info-settings-button"
          onClick={handleNavigateSettingsForm}
        >
          Settings
        </button>
        <button
          className="user-schedule-settings-button"
          onClick={handleNavigateHomeForm}
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default AccountPage;

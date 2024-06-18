import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetInfo, useUserProfile } from "../hooks/useQueryHooks";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import "./PageStyles/PageStyles.css";
import WeekendIcon from "@mui/icons-material/Weekend";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";

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

  if (isUserLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="user-info-container-parent">
      <h1 className="user-info-username">
        {userData ? userData.user_name : "Loading..."}
      </h1>
      <div className="breakpoint-2">
        <hr />
      </div>
      <div className="user-info-container-child">
        <div className="user-info-wrapper">
          <div className="general-info-container">
            <div className="account-info-general-container">
              <div className="acc-icon-header-container">
                <WeekendIcon />
                <h3 className="user-info-h3">Weekend Status</h3>
              </div>
              <span className="user-info-span">
                {isAvailabilityLoading
                  ? "Loading availability..."
                  : orgInfo
                  ? orgInfo.exclude_weekends
                    ? "Unavailable"
                    : "Available"
                  : "Edit Organisation"}
              </span>
            </div>
            <div className="account-info-general-container">
              <div className="acc-icon-header-container">
                <WorkIcon />
                <h3 className="user-info-h3">Services Offered</h3>
              </div>

              <span className="user-info-span">
                {isAvailabilityLoading
                  ? "Loading services..."
                  : orgInfo
                  ? orgInfo.service_offered
                  : "..."}
              </span>
            </div>

            <div className="account-info-general-container">
              <div className="acc-icon-header-container">
                <AccessTimeIcon />
                <h3 className="user-info-h3">Working Hours</h3>
              </div>
              <span className="user-info-span">
                {isAvailabilityLoading
                  ? "Loading hours..."
                  : orgInfo
                  ? `${orgInfo?.start_hour} - ${orgInfo?.end_hour}`
                  : "edit info"}
              </span>
            </div>
            <div className="account-info-general-container">
              <div className="acc-icon-header-container">
                <LocationOnIcon />
                <h3 className="user-info-h3">Location</h3>
              </div>

              <span className="user-info-span">
                {isAvailabilityLoading
                  ? "Loading location..."
                  : orgInfo
                  ? orgInfo.location
                  : "Edit Location"}
              </span>
            </div>
          </div>
        </div>
        <div className="user-button-container">
          <button
            className="user-info-org-button"
            onClick={handleNavigateToAvailabilityForm}
          >
            Edit Organisation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

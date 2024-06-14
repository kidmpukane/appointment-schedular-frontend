import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetInfo, useUserProfile } from "../hooks/useQueryHooks";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import "./PageStyles/PageStyles.css";

// const useUserProfile = (userId, csrfToken, sessionId) => {
//   return {
//     data: mockUserProfile,
//     isLoading: false,
//     isError: false,
//   };
// };

// const { data } = useGetInfo(
//   `http://127.0.0.1:8000/availability/availability/user/${userProfile?.id}/`
// );

// console.log(data ? data : "No data...");

const AccountPage = () => {
  const navigate = useNavigate();
  const { authInfo } = useContext(AuthenticationContext);
  const { data: userData } = useUserProfile(
    authInfo.userId,
    authInfo.csrfToken,
    authInfo.sessionId
  );
  authInfo.profileId = userData?.id;

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error fetching user profile data</div>;
  // }

  const handleNavigateToAvailabilityForm = () => {
    navigate("/availability-form", {
      state: { userProfileId: userData?.id },
    });
  };

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
            {/* <span className="user-info-span">
              {myData.exclude_weekends
                ? "Your organisation does not work weekends"
                : "Your organisation works weekends"}
            </span> */}
          </div>
          <h3 className="user-info-h3">Services Offered:</h3>
          {/* <span className="user-info-span">{myData?.service_offered}</span> */}
          <h3 className="user-info-h3">Working Hours:</h3>
          {/* <span className="user-info-span">{`${myData?.start_hour} - ${myData?.end_hour}`}</span> */}
          <h3 className="user-info-h3">Location:</h3>
          {/* <span className="user-info-span">{myData?.location}</span> */}
        </div>
      </div>
      <div className="user-button-container">
        <button
          className="user-info-org-button"
          // onClick={handleNavigateToAvailabilityForm}
        >
          Edit Organisation
        </button>
        <button
          className="user-info-settings-button"
          onClick={() => {
            navigate("/settings");
          }}
        >
          Settings
        </button>
        <button
          className="user-schedule-settings-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default AccountPage;

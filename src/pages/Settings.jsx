import "./PageStyles/PageStyles.css";
import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import { useProfilePut } from "../hooks/useQueryHooks";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userProfileId = location.state?.userProfileId || null;
  const { authInfo, updateAuthInfo } = useContext(AuthenticationContext);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user_profile/edit-profile/${authInfo.userId}`
      );
      setUserName(response.data.user_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authInfo.userId]);

  const handleLogout = () => {
    updateAuthInfo({
      csrfToken: null,
      sessionId: null,
      userId: null,
    });
    localStorage.removeItem("csrfToken");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const { mutate: updateUserProfile, isLoading } = useProfilePut(
    authInfo,
    `http://127.0.0.1:8000/user_profile/edit-profile/${authInfo.userId}/`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    updateUserProfile(
      {
        id: userProfileId,
        user_name: userName,
        user: authInfo.userId,
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: () => {
          setError("Failed to update username. Please try again.");
        },
      }
    );
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_name">Username:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Save Changes
        </button>
      </form>
      {success && <p>Username updated successfully!</p>}
      {error && <p>{error}</p>}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Settings;

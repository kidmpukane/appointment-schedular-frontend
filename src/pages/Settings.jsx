import "./PageStyles/PageStyles.css";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";

const Settings = () => {
  const navigate = useNavigate();
  const { updateAuthInfo } = useContext(AuthenticationContext);

  // Correctly placed useEffect hook
  useEffect(() => {
    // This useEffect will run when the component mounts, but it's not necessary for logout functionality
    // You can remove this if it's not needed for your use case
  }, []);

  const handleLogout = () => {
    // Clear the authentication state
    updateAuthInfo({
      csrfToken: null,
      sessionId: null,
      userId: null,
    });

    // Remove any authentication-related data from localStorage or other storage
    localStorage.removeItem("csrfToken");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");

    // Navigate to the login page or any other desired route
    window.location.reload(); // Assuming "/login" is your login route
  };

  return (
    <div>
      <h1>Settings</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Settings;

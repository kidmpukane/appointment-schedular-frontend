import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../authProviders/AuthenticationProvider";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { updateAuthInfo } = useContext(AuthenticationContext);

  useEffect(() => {
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
      window.location.reload();
    };

    handleLogout();
  }, [navigate, updateAuthInfo]);

  return <div>Logging out...</div>;
};

export default LogoutPage;

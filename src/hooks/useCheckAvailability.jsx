import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";

const useCheckAvailability = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { authInfo } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/availability/availability/user/${authInfo.profileId}/`
        );
        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/availability-registration-form");
        } else {
          console.error(
            "An error occurred while checking availability:",
            error
          );
        }
      }
    };

    checkAvailability();
  }, [authInfo.profileId, navigate]);

  return isLoading;
};

export default useCheckAvailability;

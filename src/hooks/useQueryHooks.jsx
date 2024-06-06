import { useQuery, useMutation } from "react-query";
import axios from "axios";

const useGetInfo = (infoUrl) => {
  const fetchInfo = async () => {
    const response = await axios.get(infoUrl);
    return response.data;
  };

  const { isLoading, data, isError, error, refetch } = useQuery(
    ["fetched-info", infoUrl],
    fetchInfo
  );

  return { isLoading, data, isError, error, refetch };
};

export const useLogin = () => {
  const loginUser = async ({ email, password }) => {
    const response = await axios.post(
      "http://127.0.0.1:8000/authentication/login",
      { email, password }
    );
    return response.data;
  };
  return useMutation(loginUser);
};

export const useSignUp = () => {
  const signUpUser = async ({ firstName, lastName, email, password }) => {
    const response = await axios.post("/api/users/signup", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  };
  return useMutation(signUpUser);
};

const useUserProfile = (userId, csrfToken, sessionId) => {
  return useQuery(["userProfile", userId], async () => {
    const response = await axios.get(
      `http://127.0.0.1:8000/user_profile/fetch-user-profile/${userId}/`,
      {
        headers: {
          "X-CSRFToken": csrfToken,
          sessionid: sessionId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  });
};

const useAvailabilitySubmit = (authInfo) => {
  const submitAvailability = async (formData) => {
    const response = await axios.post(
      "http://127.0.0.1:8000/availability/register-availability/",
      {
        ...formData,
        provider: formData.provider.userProfileId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": authInfo.csrfToken,
          sessionid: authInfo.sessionId,
        },
        withCredentials: true,
      }
    );
    return response.data;
  };

  return useMutation(submitAvailability);
};

export { useGetInfo, useUserProfile, useAvailabilitySubmit };

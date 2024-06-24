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

const useAvailabilityPost = (authInfo, availabilityUrlPost) => {
  const submitAvailability = async (formData) => {
    try {
      console.log("Form data before processing:", formData);

      const dataToSend = {
        ...formData,
        provider: formData.provider.userProfileId,
      };

      console.log("Data to send:", dataToSend);

      const csrfToken = getCsrfToken();

      const response = await axios.post(availabilityUrlPost, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          sessionid: authInfo.sessionId,
        },
        withCredentials: true,
      });

      console.log("Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      throw error;
    }
  };

  return useMutation(submitAvailability);
};

export default useAvailabilityPost;

const getCsrfToken = () => {
  let csrfToken = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === "csrftoken=") {
        csrfToken = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return csrfToken;
};

const useAvailabilityPut = (authInfo, availabilityUrlPut) => {
  const submitAvailability = async (formData) => {
    try {
      const dataToSend = {
        ...formData,
        provider: formData.provider.userProfileId,
      };

      const csrfToken = getCsrfToken();

      const response = await axios.put(availabilityUrlPut, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          sessionid: authInfo.sessionId,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      throw error;
    }
  };

  return useMutation(submitAvailability);
};

const useProfilePut = (authInfo, profileUrlPut) => {
  const submitProfile = async (formData) => {
    try {
      const dataToSend = {
        ...formData,
      };
      console.log("Form data being sent:", dataToSend);
      const csrfToken = getCsrfToken();

      const response = await axios.put(profileUrlPut, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          sessionid: authInfo.sessionId,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response);
      throw error;
    }
  };

  return useMutation(submitProfile);
};

const useGetAuthInfo = (queryKey, url) => {
  const fetchInfo = async () => {
    if (!url) {
      throw new Error("URL is not defined");
    }

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  return useQuery([queryKey, url], fetchInfo, {
    enabled: !!url,
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error(`Error in ${queryKey} query:`, error);
    },
  });
};

export {
  useGetInfo,
  useUserProfile,
  useAvailabilityPut,
  useAvailabilityPost,
  useProfilePut,
  useGetAuthInfo,
};

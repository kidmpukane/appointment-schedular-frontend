import { createContext, useState, useEffect } from "react";
import { useGetInfo } from "../../hooks/useQueryHooks";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({
    csrfToken: null,
    sessionId: null,
    userId: null,
    profileId: null,
  });

  useEffect(() => {
    const storedCsrfToken = localStorage.getItem("csrfToken");
    const storedSessionId = localStorage.getItem("sessionId");
    const userId = localStorage.getItem("userId");

    if (storedCsrfToken && storedSessionId) {
      setAuthInfo({
        csrfToken: storedCsrfToken,
        sessionId: storedSessionId,
        userId: userId,
      });
    }
  }, []);

  const infoUrl = authInfo.userId
    ? `http://127.0.0.1:8000/user_profile/fetch-user-profile/${authInfo.userId}/`
    : null;

  const { data } = useGetInfo(infoUrl);

  useEffect(() => {
    if (data) {
      setAuthInfo((prevAuthInfo) => ({
        ...prevAuthInfo,
        profileId: data.id,
      }));
    }
  }, [data]);

  const updateAuthInfo = (newAuthInfo) => {
    setAuthInfo((prevAuthInfo) => ({ ...prevAuthInfo, ...newAuthInfo }));

    if (newAuthInfo.csrfToken) {
      localStorage.setItem("csrfToken", newAuthInfo.csrfToken);
    }
    if (newAuthInfo.sessionId) {
      localStorage.setItem("sessionId", newAuthInfo.sessionId);
    }
    if (newAuthInfo.userId) {
      localStorage.setItem("userId", newAuthInfo.userId);
    }
    if (newAuthInfo.profileId) {
      localStorage.setItem("profileId", newAuthInfo.profileId);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ authInfo, updateAuthInfo }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

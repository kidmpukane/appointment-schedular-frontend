import { useContext, useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import ApplicationStack from "./authentication/authPages/ApplicationStack";
import AuthenticationStack from "./authentication/authPages/AuthenticationStack";
import {
  AuthenticationProvider,
  AuthenticationContext,
} from "./authentication/authProviders/AuthenticationProvider";

const App = () => {
  const { authInfo } = useContext(AuthenticationContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially set to true

  useEffect(() => {
    // Check if the sessionId exists to determine authentication status
    const sessionId = authInfo?.sessionId;
    setIsAuthenticated(!!sessionId);

    // Set isLoading to false only after checking the authentication status
    setIsLoading(false);
  }, [authInfo]);

  if (isLoading) {
    return <LoadingScreen />; // Display the loading screen while checking authentication status
  }

  return (
    <AuthenticationProvider>
      {isAuthenticated ? <ApplicationStack /> : <AuthenticationStack />}
    </AuthenticationProvider>
  );
};

export default App;

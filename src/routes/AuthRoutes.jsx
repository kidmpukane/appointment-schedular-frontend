import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../authentication/authForms/LoginPage";
import SignupForm from "../authentication/authForms/SignUpPage";
// import AppointmentPage from "../pages/AppointmentPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import Checkout from "../authentication/authForms/Checkout";
import Success from "../authentication/authForms/Success";
import Failure from "../authentication/authForms/Failure";
import LandingPage from "../authentication/authPages/LandingPage";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/log-in" element={<LoginForm />} />
      <Route path="/registration" element={<SignupForm />} />
      <Route path="/book-appointment" element={<AnalyticsPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/failure" element={<Failure />} />
      <Route path="*" element={<Navigate to="/log-in" />} />
    </Routes>
  );
}

export default AuthRoutes;

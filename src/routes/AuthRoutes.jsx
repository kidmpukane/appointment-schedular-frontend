import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "../authentication/authForms/LoginPage";
import SignupForm from "../authentication/authForms/SignUpPage";
import AppointmentPage from "../pages/AppointmentPage";
import AnalyticsPage from "../pages/AnalyticsPage";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/log-in" element={<LoginForm />} />
      <Route path="/registration" element={<SignupForm />} />
      <Route path="/book-appointment" element={<AnalyticsPage />} />

      <Route path="*" element={<Navigate to="/log-in" />} />
    </Routes>
  );
}

export default AuthRoutes;

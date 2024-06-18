import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import BillingAndSubscription from "../pages/BillingandSubscription";
import HelpPage from "../pages/HelpPage";
import AccountPage from "../pages/AccountPage";
import Settings from "../pages/Settings";
import AnalyticsPage from "../pages/AnalyticsPage";
import AvailabilityRegistrationPage from "../pages/AvailabilityRegistrationPage";
import AvailabilityEditPage from "../pages/AvailabilityEditPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route
        path="/billing-and-subscription"
        element={<BillingAndSubscription />}
      />
      <Route
        path="/availability-edit-form"
        element={<AvailabilityEditPage />}
      />
      <Route
        path="/availability-registration-form"
        element={<AvailabilityRegistrationPage />}
      />
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default AppRoutes;

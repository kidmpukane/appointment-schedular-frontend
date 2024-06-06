import Sidebar from "../../routes/Sidebar";
import AccountPage from "../../pages/AccountPage";
import HomePage from "../../pages/HomePage";
import AppRoutes from "../../routes/AppRoutes";
import "../../App.css";

const ApplicationStack = () => {
  return (
    <div className="app-grid">
      <div className="sidebar">
        <AccountPage />
      </div>
      <div className="main">
        <AppRoutes />
      </div>
    </div>
  );
};

export default ApplicationStack;

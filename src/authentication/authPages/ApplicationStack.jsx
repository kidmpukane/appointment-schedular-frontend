import "../../App.css";
import Header from "../../routes/Header";
import AppRoutes from "../../routes/AppRoutes";

const ApplicationStack = () => {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <AppRoutes />
      </div>
    </div>
  );
};

export default ApplicationStack;

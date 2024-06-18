import "../../App.css";
import Header from "../../routes/Header";
import AppRoutes from "../../routes/AppRoutes";

const ApplicationStack = () => {
  return (
    <div className="app">
      <Header />
      <AppRoutes />
    </div>
  );
};

export default ApplicationStack;

import AppRoutes from "../../routes/AppRoutes";
import "../../App.css";
import Header from "../../routes/Header";
const ApplicationStack = () => {
  return (
    <div className="app">
      <Header />
      <AppRoutes />
    </div>
  );
};

export default ApplicationStack;

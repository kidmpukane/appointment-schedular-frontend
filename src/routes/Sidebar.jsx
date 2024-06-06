import { useState } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import "./styling/routesStyles.css";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div id="sidebar" className="sidebar">
      <h2 className="sidebar-header">resolution.</h2>
      <button className="menu-toggle" onClick={toggleMenu}>
        Menu
      </button>
      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/account">
              <AccountIcon />
              <span>Account</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <HomeIcon />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

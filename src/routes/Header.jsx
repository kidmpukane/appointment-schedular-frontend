import React, { useState } from "react";
import "./styling/routesStyles.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <h1>My Website</h1>
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </button>
      <nav className={isMenuOpen ? "nav-open" : ""}>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/account">Account</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

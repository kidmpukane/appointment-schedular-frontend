import "./styling/routesStyles.css";

const Header = () => {
  return (
    <header className="header">
      <h1>My Website</h1>
      <nav>
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

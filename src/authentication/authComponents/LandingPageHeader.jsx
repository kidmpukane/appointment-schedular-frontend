import "../authStyles/authStyles.css";

const LandingPageHeader = () => {
  return (
    <header className="header">
      <div className="landing-page-header-container">
        <h1 className="logo">bookio.io</h1>
        <div className="landing-page-button-container">
          <a className="pricing-button">Pricing</a>
          <button className="sign-in-button">Sign in</button>
        </div>
      </div>
    </header>
  );
};

export default LandingPageHeader;

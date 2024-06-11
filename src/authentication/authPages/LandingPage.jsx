import "../authStyles/authStyles.css";
import LandingPageCTA from "../authComponents/LandingPageCTA";
import LandingPageHeader from "../authComponents/LandingPageHeader";
import LandingPageFooter from "../authComponents/LandingPageFooter";

function LandingPage() {
  return (
    <div className="landing-page">
      <LandingPageHeader />
      {/* <LandingPageCTA />
      <LandingPageFooter /> */}
    </div>
  );
}

export default LandingPage;

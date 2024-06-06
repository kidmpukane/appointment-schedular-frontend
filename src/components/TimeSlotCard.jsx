import "./componentStyles/ComponentStyles.css";

function TimeSlotCard() {
  return (
    <div className="time-card-container">
      <h1 className="card-heading">Time</h1>
      <span className="card-span">Available time slots</span>
      <div className="time-view"></div>
    </div>
  );
}

export default TimeSlotCard;

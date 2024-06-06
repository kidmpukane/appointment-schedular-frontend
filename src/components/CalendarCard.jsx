import "./componentStyles/ComponentStyles.css";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarCard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected Date:", date);
  };

  return (
    <div className="calendar-card-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        calendarType="gregory"
        className="calender-body"
      />
    </div>
  );
}

export default CalendarCard;

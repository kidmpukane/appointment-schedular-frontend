import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./PageStyles/PageStyles.css";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

const getDaysInMonth = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const dates = [];

  // Fill in days from the previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dates.push({ day: daysInPrevMonth - i, monthOffset: -1 });
  }

  // Fill in days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({ day, monthOffset: 0 });
  }

  // Fill in days from the next month
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({ day: i, monthOffset: 1 });
  }

  return dates;
};

const HomePage = () => {
  const location = useLocation();
  const userProfileId = location.state?.userProfileId || null;

  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (userProfileId) {
      axios
        .get(
          `http://127.0.0.1:8000/appointments/get-appointment/${userProfileId}/`
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  }, [userProfileId]);

  const days = getDaysInMonth(currentYear, currentMonth);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isSameDay = (day1, day2) => {
    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  };

  const hasMeeting = (date) => {
    return data.some((meeting) => isSameDay(new Date(meeting.date), date));
  };

  return (
    <div className="calendar-container-home">
      <div className="calendar-view-home">
        <div className="month-header">
          <button className="prev-month-button" onClick={previousMonth}>
            {"<"}
          </button>
          <h2 className="month-title">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button className="next-month-button" onClick={nextMonth}>
            {">"}
          </button>
        </div>
        <div className="weekday-labels-home-container">
          {dayNames.map((dayName) => (
            <div key={dayName} className="weekday-label-home">
              {dayName}
            </div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((date, index) => {
            const isCurrentMonth = date.monthOffset === 0;
            const dayDate = new Date(
              currentYear,
              currentMonth + date.monthOffset,
              date.day
            );
            const isSelected = isSameDay(dayDate, selectedDay);
            const isToday = isSameDay(dayDate, new Date());
            const hasMeetingDot = hasMeeting(dayDate);
            const dayButtonClass = `
              day-button
              ${isSelected ? "selected-day" : ""}
              ${isToday ? "today" : ""}
              ${isCurrentMonth ? "" : "outside-month"}
            `;

            return (
              <div key={index} className="day-container">
                <button
                  className={dayButtonClass}
                  onClick={() => setSelectedDay(dayDate)}
                >
                  {date.day}
                  {hasMeetingDot && <div className="meeting-dot"></div>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="schedule-view">
        <h2 className="schedule-title">Appointments</h2>
        <ul className="meeting-list">
          {data
            .filter((meeting) => isSameDay(new Date(meeting.date), selectedDay))
            .map((meeting) => (
              <li key={meeting.id} className="meeting-item">
                <div className="meeting-details">
                  <span className="meeting-name">{meeting.full_name}</span>
                  <span className="meeting-time">
                    {new Date(meeting.time_slot).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="meeting-service">{meeting.service}</span>
                <div className="meeting-buttons">
                  <button className="delete-meeting-button">Delete</button>
                  <button className="reschedule-meeting-button">
                    Reschedule
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;

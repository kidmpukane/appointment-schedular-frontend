import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PageStyles/PageStyles.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import { useUserProfile } from "../hooks/useQueryHooks";
import useCheckAvailability from "../hooks/useCheckAvailability";

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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const dates = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dates.push({ day: daysInPrevMonth - i, monthOffset: -1 });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({ day, monthOffset: 0 });
  }
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({ day: i, monthOffset: 1 });
  }

  return dates;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").slice(0, 2).map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const formattedHours = String(displayHours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authInfo } = useContext(AuthenticationContext);

  const userProfileId = location.state?.userProfileId || null;

  const [data, setData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const isLoading = useCheckAvailability();

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

  const handleDeleteAppointment = (appointmentId) => {
    axios
      .delete(
        `http://127.0.0.1:8000/appointments/delete-appointment/${appointmentId}/`
      )
      .then((response) => {
        console.log("Appointment deleted successfully:", response.data);
        setData(data.filter((appointment) => appointment.id !== appointmentId));
      })
      .catch((error) => {
        console.error("Error deleting appointment:", error);
      });
  };

  const { data: userData, isLoading: isUserLoading } = useUserProfile(
    authInfo.userId,
    authInfo.csrfToken,
    authInfo.sessionId
  );

  const handleNavigateHomeForm = () => {
    navigate("/", {
      state: { userProfileId: userData?.id },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container-home">
      <div className="calendar-view-home">
        <div className="month-header">
          <h2 className="month-title">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button className="prev-month-button" onClick={previousMonth}>
            <ArrowBackIosIcon fontSize="small" />
          </button>
          <button className="next-month-button" onClick={nextMonth}>
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
        <div className="calendar-mnd-container">
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
      </div>
      <div className="schedule-view">
        <div className="appointment-container">
          <h2 className="schedule-title">Appointments</h2>
          <button className="refresh-button" onClick={handleNavigateHomeForm}>
            <RefreshIcon fontSize="small" />
          </button>
        </div>
        <div className="schedule-view-container">
          {data
            .filter((meeting) => isSameDay(new Date(meeting.date), selectedDay))
            .map((meeting) => (
              <div key={meeting.id} className="task-card">
                <ul className="meeting-list">
                  <li className="meeting-item">
                    <div className="meeting-details">
                      <div className="meeting-time-date-container">
                        <span className="meeting-time">
                          {formatTime(meeting.time_slot)}
                        </span>
                        <span className="meeting-date">{meeting.date}</span>
                      </div>
                      <span className="meeting-service">{meeting.service}</span>
                      <button
                        onClick={() => handleDeleteAppointment(meeting.id)}
                        className="delete-meeting-button"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                    <div className="breakpoint">
                      <hr />
                    </div>
                    <div className="meeting-client-container">
                      <span className="meeting-client-name">
                        {meeting.full_name}
                      </span>
                      <span className="meeting-client-email">
                        {meeting.email}
                      </span>
                      <span className="meeting-location">
                        {meeting.location}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

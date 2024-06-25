import React, { useState } from "react";
import axios from "axios";
import { useGetAuthInfo } from "../hooks/useQueryHooks";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../authentication/authStyles/authStyles.css";

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

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const backendConfig = {
  exclude_months: "12",
  exclude_days: "2, 14",
  exclude_weekends: true,
  work_block: "00:30:00",
  break_block: "00:30:00",
  start_hour: "09:00:00",
  end_hour: "17:00:00",
  timezone: "UTC",
};

const getDaysInMonth = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const dates = [];

  // Fill in days from the previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dates.push({
      day: daysInPrevMonth - i,
      monthOffset: -1,
    });
  }

  // Fill in days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push({
      day,
      monthOffset: 0,
    });
  }

  // Fill in days from the next month
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      day: i,
      monthOffset: 1,
    });
  }

  return dates;
};

const AppointmentPage = () => {
  const organisationInfoUrl = `http://127.0.0.1:8000/availability/availability/Athens/`;

  const {
    isLoading: isLoadingOrgInfo,
    data: orgInfoData,
    isError: isErrorOrgInfo,
    error: errorOrgInfo,
  } = useGetAuthInfo("orgInfo", organisationInfoUrl);

  const providerId =
    Array.isArray(orgInfoData) && orgInfoData.length > 0
      ? orgInfoData[0]?.provider?.id
      : null;

  // Use useEffect to fetch appointments
  React.useEffect(() => {
    if (providerId) {
      axios
        .get(
          `http://127.0.0.1:8000/appointments/get-appointment/${providerId}/`
        )
        .then((response) => {
          let appointmentData = response.data;
          console.log(appointmentData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [providerId]);

  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const isDayBlocked = (day, dayOfWeek, monthIndex, monthOffset) => {
    if (monthOffset !== 0) return true;
    if (backendConfig.exclude_weekends && (dayOfWeek === 0 || dayOfWeek === 6))
      return true;
    if (
      backendConfig.exclude_months.split(",").includes(String(monthIndex + 1))
    )
      return true;
    if (backendConfig.exclude_days.split(",").includes(String(day)))
      return true;
    return false;
  };

  const handleDayClick = (day, monthOffset) => {
    if (monthOffset !== 0) return;
    setSelectedDay(new Date(currentYear, currentMonth, day));
    setIsFormOpen(true);
  };

  const isSameDay = (day1, day2) => {
    return (
      day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate()
    );
  };

  if (isLoadingOrgInfo) return <div>Loading...</div>;
  if (isErrorOrgInfo)
    return <div>Error loading organization info: {errorOrgInfo.message}</div>;

  return (
    <div className="calendar-container">
      <div className="calendar-view">
        <div className="month-header">
          <div className="navigation-buttons">
            <div className="calendar-header-container">
              <h2 className="month-title">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="arrow-button-container">
                <button onClick={previousMonth} className="prev-month-button">
                  <ArrowBackIosIcon fontSize="small" />
                </button>
                <button onClick={nextMonth} className="next-month-button">
                  <ArrowForwardIosIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="weekday-labels">
          {dayNames.map((dayName) => (
            <div key={dayName} className="weekday-label">
              {dayName.substring(0, 3)}
            </div>
          ))}
        </div>
        <div className="days-grid">
          {days.map(({ day, monthOffset }, dayIdx) => {
            const date = new Date(currentYear, currentMonth + monthOffset, day);
            const dayOfWeek = date.getDay();
            const isSelected = isSameDay(date, selectedDay);
            const isToday = isSameDay(date, today);
            const isCurrentMonth = monthOffset === 0;

            return (
              <div
                key={dayIdx}
                className={`day-container ${
                  dayIdx === 0 ? `col-start-${dayOfWeek + 1}` : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleDayClick(day, monthOffset)}
                  className={`day-button ${
                    isDayBlocked(day, dayOfWeek, currentMonth, monthOffset)
                      ? "blocked-day"
                      : ""
                  } ${isSelected ? "selected-day" : ""} ${
                    isToday ? "today" : ""
                  } ${isCurrentMonth ? "" : "outside-month"}`}
                  disabled={isDayBlocked(
                    day,
                    dayOfWeek,
                    currentMonth,
                    monthOffset
                  )}
                >
                  <time
                    dateTime={`${currentYear}-${
                      currentMonth + monthOffset + 1
                    }-${day}`}
                  >
                    {day}
                  </time>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AppointmentForm
              selectedDay={selectedDay}
              onClose={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TimeSlots = ({ selectedDay, onTimeSlotSelect }) => {
  const generateTimeSlots = () => {
    const slots = [];
    const startDate = new Date(
      `${selectedDay.toISOString().split("T")[0]}T${backendConfig.start_hour}`
    );
    const endDate = new Date(
      `${selectedDay.toISOString().split("T")[0]}T${backendConfig.end_hour}`
    );
    const workBlockDuration = parseTimeString(backendConfig.work_block);

    let currentTime = startDate;
    while (currentTime <= endDate) {
      slots.push(currentTime);
      currentTime = new Date(currentTime.getTime() + workBlockDuration);
    }

    return slots;
  };

  const parseTimeString = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="time-slots">
      <h3>Available Time Slots</h3>
      <ul>
        {timeSlots.map((slot, index) => (
          <li key={index} onClick={() => onTimeSlotSelect(slot)}>
            {slot.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AppointmentForm = ({ selectedDay, onClose }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSlotSelect = (slot) => {
    setSelectedTime(slot);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    onClose();
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>
      <p>{selectedDay.toDateString()}</p>
      <form onSubmit={handleSubmit}>
        <TimeSlots
          selectedDay={selectedDay}
          onTimeSlotSelect={handleTimeSlotSelect}
        />
        {selectedTime && (
          <div>
            <p>Selected Time: {selectedTime.toLocaleTimeString()}</p>
            <button type="submit">Confirm Appointment</button>
          </div>
        )}
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AppointmentPage;

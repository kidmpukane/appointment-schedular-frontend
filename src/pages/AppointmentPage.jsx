import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  exclude_particular_days: "2, 14",
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

  let availabilitySpecs =
    Array.isArray(orgInfoData) && orgInfoData.length > 0
      ? orgInfoData[0]
      : backendConfig;

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

    // Check for excluded weekends
    if (
      availabilitySpecs?.exclude_weekends &&
      (dayOfWeek === 0 || dayOfWeek === 6)
    ) {
      return true;
    }

    // Check for excluded months
    const excludedMonths =
      Array.isArray(availabilitySpecs?.exclude_months) &&
      availabilitySpecs.exclude_months.length > 0
        ? availabilitySpecs.exclude_months.filter((m) => m !== null).map(String)
        : [];
    if (excludedMonths.includes(String(monthIndex + 1))) {
      return true;
    }

    // Check for excluded days
    const excludedDays =
      Array.isArray(availabilitySpecs?.exclude_particular_days) &&
      availabilitySpecs.exclude_particular_days.length > 0
        ? availabilitySpecs.exclude_particular_days
            .filter((d) => d !== null)
            .map(String)
        : [];
    if (excludedDays.includes(String(day))) {
      return true;
    }

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
              availabilitySpecs={availabilitySpecs}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TimeSlots = ({ selectedDay, onTimeSlotSelect, availabilitySpecs }) => {
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = availabilitySpecs?.start_hour || "09:00:00";
    const endHour = availabilitySpecs?.end_hour || "17:00:00";
    const workBlock = availabilitySpecs?.work_block || "00:30:00";

    const startDate = new Date(
      `${selectedDay.toISOString().split("T")[0]}T${startHour}`
    );
    const endDate = new Date(
      `${selectedDay.toISOString().split("T")[0]}T${endHour}`
    );
    const workBlockDuration = parseTimeString(workBlock);

    let currentTime = startDate;
    while (currentTime <= endDate) {
      slots.push(new Date(currentTime));
      currentTime = new Date(currentTime.getTime() + workBlockDuration);
    }

    return slots;
  };

  const parseTimeString = (timeString) => {
    if (!timeString || typeof timeString !== "string") return 0;
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

// Form validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  service: Yup.string().required("Service is required"),
  location: Yup.string().required("Location is required"),
  notes: Yup.string(),
});

const AppointmentForm = ({ selectedDay, onClose, availabilitySpecs }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      service: "",
      location: "",
      notes: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const appointmentData = {
        ...values,
        date: selectedDay.toISOString().split("T")[0],
        time_slot: selectedTime.toLocaleTimeString("en-US", { hour12: false }),
      };
      // Submit appointmentData to the backend
      console.log(appointmentData);
      onClose();
    },
  });

  const handleTimeSlotSelect = (slot) => {
    setSelectedTime(slot);
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>
      <p>{selectedDay.toDateString()}</p>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <div className="error">{formik.errors.fullName}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="service">Service</label>
          <input
            id="service"
            name="service"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.service}
          />
          {formik.touched.service && formik.errors.service ? (
            <div className="error">{formik.errors.service}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.location}
          />
          {formik.touched.location && formik.errors.location ? (
            <div className="error">{formik.errors.location}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notes}
          />
          {formik.touched.notes && formik.errors.notes ? (
            <div className="error">{formik.errors.notes}</div>
          ) : null}
        </div>
        <TimeSlots
          selectedDay={selectedDay}
          onTimeSlotSelect={handleTimeSlotSelect}
          availabilitySpecs={availabilitySpecs}
        />
        {selectedTime && (
          <div>
            <p>
              Selected Time:{" "}
              {selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
        <button type="submit" disabled={!selectedTime}>
          Confirm Appointment
        </button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AppointmentPage;

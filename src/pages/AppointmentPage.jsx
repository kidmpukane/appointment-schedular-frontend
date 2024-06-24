import { useGetAuthInfo } from "../hooks/useQueryHooks";

const AppointmentPage = () => {
  const organisationInfoUrl = `http://127.0.0.1:8000/availability/availability/Athens/`;

  const {
    isLoading: isLoadingOrgInfo,
    data: orgInfoData,
    isError: isErrorOrgInfo,
    error: errorOrgInfo,
  } = useGetAuthInfo("orgInfo", organisationInfoUrl);

  // Check if orgInfoData is an array and has elements before accessing [0]
  const providerId =
    Array.isArray(orgInfoData) && orgInfoData.length > 0
      ? orgInfoData[0]?.provider?.id
      : null;

  const appointmentsUrl = providerId
    ? `http://127.0.0.1:8000/appointments/get-appointment/${providerId}/`
    : null;

  const {
    isLoading: isLoadingAppointments,
    data: appointmentsData,
    isError: isErrorAppointments,
    error: errorAppointments,
  } = useGetAuthInfo("appointments", appointmentsUrl);

  if (isLoadingOrgInfo || isLoadingAppointments) return <div>Loading...</div>;
  if (isErrorOrgInfo)
    return <div>Error loading organization info: {errorOrgInfo.message}</div>;
  if (isErrorAppointments)
    return <div>Error loading appointments: {errorAppointments.message}</div>;

  return (
    <div>
      <h1>AppointmentPage</h1>
      <h2>Organization Info</h2>
      <pre>{JSON.stringify(orgInfoData, null, 2)}</pre>
      <h2>Appointments</h2>
      <pre>{JSON.stringify(appointmentsData, null, 2)}</pre>
    </div>
  );
};

export default AppointmentPage;

// import { useState } from "react";
// import { useGetAuthInfo } from "../hooks/useQueryHooks";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import "../authentication/authStyles/authStyles.css";

// const monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const dayNames = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const backendConfig = {
//   exclude_months: "12",
//   exclude_days: "2, 14",
//   exclude_weekends: true,
//   work_block: "00:30:00",
//   break_block: "00:30:00",
//   start_hour: "09:00:00",
//   end_hour: "17:00:00",
//   timezone: "UTC",
// };

// const getDaysInMonth = (year, monthIndex) => {
//   const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
//   const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
//   const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

//   const dates = [];

//   // Fill in days from the previous month
//   for (let i = firstDayOfMonth - 1; i >= 0; i--) {
//     dates.push({
//       day: daysInPrevMonth - i,
//       monthOffset: -1,
//     });
//   }

//   // Fill in days from the current month
//   for (let day = 1; day <= daysInMonth; day++) {
//     dates.push({
//       day,
//       monthOffset: 0,
//     });
//   }

//   // Fill in days from the next month
//   const remainingDays = 42 - dates.length;
//   for (let i = 1; i <= remainingDays; i++) {
//     dates.push({
//       day: i,
//       monthOffset: 1,
//     });
//   }

//   return dates;
// };

// const AppointmentPage = () => {
//   const today = new Date();
//   const [selectedDay, setSelectedDay] = useState(today);
//   const [currentMonth, setCurrentMonth] = useState(today.getMonth());
//   const [currentYear, setCurrentYear] = useState(today.getFullYear());
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const days = getDaysInMonth(currentYear, currentMonth);

//   const previousMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//   };

//   const nextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//   };

//   const isDayBlocked = (day, dayOfWeek, monthIndex, monthOffset) => {
//     if (monthOffset !== 0) return true;
//     if (backendConfig.exclude_weekends && (dayOfWeek === 0 || dayOfWeek === 6))
//       return true;
//     if (
//       backendConfig.exclude_months.split(",").includes(String(monthIndex + 1))
//     )
//       return true;
//     if (backendConfig.exclude_days.split(",").includes(String(day)))
//       return true;
//     return false;
//   };

//   const handleDayClick = (day, monthOffset) => {
//     if (monthOffset !== 0) return;
//     setSelectedDay(new Date(currentYear, currentMonth, day));
//     setIsFormOpen(true);
//   };

//   const isSameDay = (day1, day2) => {
//     return (
//       day1.getFullYear() === day2.getFullYear() &&
//       day1.getMonth() === day2.getMonth() &&
//       day1.getDate() === day2.getDate()
//     );
//   };

//   return (
//     <div className="calendar-container">
//       <div className="calendar-view">
//         <div className="month-header">
//           <div className="navigation-buttons">
//             <div className="calendar-header-container">
//               <h2 className="month-title">
//                 {monthNames[currentMonth]} {currentYear}
//               </h2>
//               <div className="arrow-button-container">
//                 <button onClick={previousMonth} className="prev-month-button">
//                   <ArrowBackIosIcon fontSize="small" />
//                 </button>
//                 <button onClick={nextMonth} className="next-month-button">
//                   <ArrowForwardIosIcon fontSize="small" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="weekday-labels">
//           {dayNames.map((dayName) => (
//             <div key={dayName} className="weekday-label">
//               {dayName.substring(0, 3)}
//             </div>
//           ))}
//         </div>
//         <div className="days-grid">
//           {days.map(({ day, monthOffset }, dayIdx) => {
//             const date = new Date(currentYear, currentMonth + monthOffset, day);
//             const dayOfWeek = date.getDay();
//             const isSelected = isSameDay(date, selectedDay);
//             const isToday = isSameDay(date, today);
//             const isCurrentMonth = monthOffset === 0;

//             return (
//               <div
//                 key={dayIdx}
//                 className={`day-container ${
//                   dayIdx === 0 ? `col-start-${dayOfWeek + 1}` : ""
//                 }`}
//               >
//                 <button
//                   type="button"
//                   onClick={() => handleDayClick(day, monthOffset)}
//                   className={`day-button ${
//                     isDayBlocked(day, dayOfWeek, currentMonth, monthOffset)
//                       ? "blocked-day"
//                       : ""
//                   } ${isSelected ? "selected-day" : ""} ${
//                     isToday ? "today" : ""
//                   } ${isCurrentMonth ? "" : "outside-month"}`}
//                   disabled={isDayBlocked(
//                     day,
//                     dayOfWeek,
//                     currentMonth,
//                     monthOffset
//                   )}
//                 >
//                   <time
//                     dateTime={`${currentYear}-${
//                       currentMonth + monthOffset + 1
//                     }-${day}`}
//                   >
//                     {day}
//                   </time>
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       {isFormOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <AppointmentForm
//               selectedDay={selectedDay}
//               onClose={() => setIsFormOpen(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const TimeSlots = ({ selectedDay, onTimeSlotSelect }) => {
//   const generateTimeSlots = () => {
//     const slots = [];
//     const startDate = new Date(
//       `${selectedDay.toISOString().split("T")[0]}T${backendConfig.start_hour}`
//     );
//     const endDate = new Date(
//       `${selectedDay.toISOString().split("T")[0]}T${backendConfig.end_hour}`
//     );
//     const workBlockMinutes =
//       parseInt(backendConfig.work_block.split(":")[0]) * 60 +
//       parseInt(backendConfig.work_block.split(":")[1]);
//     const breakBlockMinutes =
//       parseInt(backendConfig.break_block.split(":")[0]) * 60 +
//       parseInt(backendConfig.break_block.split(":")[1]);

//     let currentDate = new Date(startDate);

//     while (currentDate < endDate) {
//       const slotStart = new Date(currentDate);
//       const slotEnd = new Date(currentDate);
//       slotEnd.setMinutes(slotEnd.getMinutes() + workBlockMinutes);

//       const isSlotAvailable = checkSlotAvailability(slotStart, slotEnd);

//       if (isSlotAvailable) {
//         slots.push({ slotStart, slotEnd });
//       }

//       currentDate.setMinutes(
//         currentDate.getMinutes() + workBlockMinutes + breakBlockMinutes
//       );
//     }
//     return slots;
//   };

//   const checkSlotAvailability = (slotStart, slotEnd) => {
//     const dayOfWeek = slotStart.getDay();
//     const day = slotStart.getDate();
//     const month = slotStart.getMonth() + 1;

//     if (
//       backendConfig.exclude_weekends &&
//       (dayOfWeek === 0 || dayOfWeek === 6)
//     ) {
//       return false;
//     }

//     if (backendConfig.exclude_days.split(",").includes(String(day))) {
//       return false;
//     }

//     if (backendConfig.exclude_months.split(",").includes(String(month))) {
//       return false;
//     }

//     return true;
//   };

//   const slots = generateTimeSlots();

//   return (
//     <div className="time-slots">
//       <select onChange={onTimeSlotSelect}>
//         <option value="">Select a time slot</option>
//         {slots.map(({ slotStart, slotEnd }, idx) => (
//           <option
//             key={idx}
//             value={`${slotStart.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })} - ${slotEnd.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}`}
//           >
//             {slotStart.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}{" "}
//             -{" "}
//             {slotEnd.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// const AppointmentForm = ({ selectedDay, onClose }) => {
//   const [formData, setFormData] = useState({
//     attendee: "",
//     start_datetime: "",
//     end_datetime: "",
//     full_name: "",
//     email: "",
//     location: "",
//     service: "Consultation",
//     service_provider: 1,
//     notes: "",
//   });

//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTimeSlotChange = (e) => {
//     const [start, end] = e.target.value.split(" - ");
//     setSelectedTimeSlot({ start, end });
//     setFormData((prev) => ({
//       ...prev,
//       start_datetime: start,
//       end_datetime: end,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     onClose();
//   };

//   return (
//     <div className="appointment-form-container">
//       <form onSubmit={handleSubmit}>
//         <div className="form-left">
//           <div>
//             <TimeSlots
//               selectedDay={selectedDay}
//               onTimeSlotSelect={handleTimeSlotChange}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               name="full_name"
//               placeholder="Full Name"
//               value={formData.full_name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={formData.location}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
//         <div className="form-right">
//           <div>
//             <label>Service</label>
//             <select
//               name="service"
//               value={formData.service}
//               onChange={handleChange}
//             >
//               <option value="Consultation">Consultation</option>
//               <option value="Follow-up">Follow-up</option>
//               <option value="Therapy">Therapy</option>
//             </select>
//           </div>
//           <div>
//             <textarea
//               name="notes"
//               placeholder="Any notes you would like to add?"
//               value={formData.notes}
//               onChange={handleChange}
//             ></textarea>
//           </div>
//           <div className="button-container">
//             <button className="submit-form-button" type="submit">
//               Submit
//             </button>
//             <button className="close-form-button" onClick={onClose}>
//               Close
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AppointmentPage;

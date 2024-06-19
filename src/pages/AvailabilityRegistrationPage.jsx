import { useState, useContext, useEffect } from "react";
import "./PageStyles/PageStyles.css";
import { AuthenticationContext } from "../authentication/authProviders/AuthenticationProvider";
import { useAvailabilityPost, useGetInfo } from "../hooks/useQueryHooks";

function AvailabilityRegistrationPage() {
  const { authInfo } = useContext(AuthenticationContext);
  const infoUrl = authInfo.userId
    ? `http://127.0.0.1:8000/user_profile/fetch-user-profile/${authInfo.userId}/`
    : null;
  const { data: profileData, isLoading, isError, error } = useGetInfo(infoUrl);

  useEffect(() => {
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        provider: {
          userProfileId: profileData.id,
        },
      }));
    }
  }, [profileData]);

  console.log(
    `Your id is ${authInfo.userId}, if you're seeing this you're all set`
  );

  if (isLoading) {
    return <p>Loading profile data...</p>;
  }

  if (isError) {
    return <p>Error loading profile data: {error.message}</p>;
  }

  if (!profileData) {
    return <p>No profile data found</p>;
  }

  console.log(`Profile Id: ${profileData.id}`);

  const [formData, setFormData] = useState({
    provider: {
      userProfileId: "",
    },
    exclude_months: [],
    exclude_particular_days: [],
    exclude_weekends: true,
    start_hour: "09:00:00",
    end_hour: "17:00:00",
    location: "",
    service_offered: "Consultation",
    timezone: "UTC",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  let availabilityUrlPost =
    "http://127.0.0.1:8000/availability/register-availability/";

  const {
    mutate: submitAvailability,
    isLoading: isSubmitting,
    isError: isSubmitError,
    error: submitError,
  } = useAvailabilityPost(authInfo, availabilityUrlPost);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAvailability(formData);
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <div className="availability-registration-container">
      {isSubmitting && <p>Submitting availability...</p>}
      {isSubmitError && (
        <p>Error submitting availability: {submitError.message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="full-width">
          <label>Exclude Months:</label>
          <select name="exclude_months" onChange={handleDateChange} value="">
            <option value="" disabled>
              Select a month to exclude
            </option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div>
            {formData.exclude_months.map((month, index) => (
              <span key={index} className="selected-month">
                {monthOptions.find((m) => m.value === parseInt(month)).label}
              </span>
            ))}
          </div>
        </div>
        <div className="full-width">
          <label>Exclude Particular Days:</label>
          <input
            type="date"
            name="exclude_particular_days"
            onChange={handleDateChange}
            value=""
          />
          <div>
            {formData.exclude_particular_days.map((day, index) => (
              <span key={index} className="selected-day">
                {new Date(day).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="exclude_weekends"
              checked={formData.exclude_weekends}
              onChange={handleChange}
            />
            Exclude Weekends
          </label>
        </div>
        <div>
          <label>Start Hour:</label>
          <input
            type="time"
            name="start_hour"
            value={formData.start_hour}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Hour:</label>
          <input
            type="time"
            name="end_hour"
            value={formData.end_hour}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
          />
        </div>
        <div>
          <label>Service Offered:</label>
          <select
            name="service_offered"
            value={formData.service_offered}
            onChange={handleChange}
          >
            <option value="Consultation">Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Therapy">Therapy</option>
          </select>
        </div>
        <div>
          <label>Timezone:</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            placeholder="e.g. UTC"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AvailabilityRegistrationPage;

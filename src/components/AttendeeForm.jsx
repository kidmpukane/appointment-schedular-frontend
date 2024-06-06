import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Formik, Form, Field, ErrorMessage } from "formik";
import dayjs from "dayjs";
import axios from "axios";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div>
      <div className="attendee-form-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Formik
            initialValues={{
              full_name: "",
              email: "",
              location: "",
              date: null,
              time_slot: null,
              service: "Consultation",
              service_provider: 1,
              notes: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.full_name) {
                errors.full_name = "Full Name is required";
              }
              if (!values.email) {
                errors.email = "Email is required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.date) {
                errors.date = "Date is required";
              }
              if (!values.time_slot) {
                errors.time_slot = "Time Slot is required";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              const formattedData = {
                full_name: values.full_name,
                email: values.email,
                location: values.location,
                date: values.date
                  ? dayjs(values.date).format("YYYY-MM-DD")
                  : "",
                time_slot: values.time_slot
                  ? dayjs(values.time_slot).format("HH:mm:ss")
                  : "",
                service: values.service,
                service_provider: values.service_provider,
                notes: values.notes,
              };

              axios
                .post(
                  "http://127.0.0.1:8000/appointments/book-appointment/",
                  formattedData
                )
                .then((response) => {
                  console.log(
                    "Appointment created successfully:",
                    response.data
                  );
                  resetForm();
                })
                .catch((error) => {
                  console.error("Error creating appointment:", error);
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                {/* Form fields */}
                <div className="form-group">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </div>
    </div>
  );
}

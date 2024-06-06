import "./PageStyles/PageStyles.css";

const BillingAndSubscription = () => {
  return <div>A</div>;
};

export default BillingAndSubscription;

// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import "./PageStyles/PageStyles.css";

// const validationSchema = Yup.object({
//   full_name: Yup.string().required("Full Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   location: Yup.string().required("Location is required"),
//   start_datetime: Yup.date().required("Start Date is required"),
//   end_datetime: Yup.date()
//     .min(
//       Yup.ref("start_datetime"),
//       "End date cannot be earlier than start date"
//     )
//     .required("End Date is required"),
//   service: Yup.string().oneOf(
//     ["Consultation", "Follow-up", "Therapy"],
//     "Service is required"
//   ),
//   service_provider: Yup.number()
//     .integer()
//     .required("Service Provider is required"),
//   notes: Yup.string(),
// });

// function AppointmentPage({ selectedDay, onClose }) {
//   const formik = useFormik({
//     initialValues: {
//       full_name: "",
//       start_datetime: "",
//       end_datetime: "",
//       email: "",
//       location: "",
//       service: "Consultation",
//       service_provider: 1,
//       notes: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: (values) => {
//       console.log(values);
//       onClose();
//     },
//   });

//   return (
//     <div className="appointment-form-container">
//       <form className="appointment-form" onSubmit={formik.handleSubmit}>
//         <h2>New Appointment</h2>
//         <label>
//           Full Name:
//           <input
//             type="text"
//             name="full_name"
//             value={formik.values.full_name}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             required
//           />
//           {formik.touched.full_name && formik.errors.full_name ? (
//             <div>{formik.errors.full_name}</div>
//           ) : null}
//         </label>
//         <label>
//           Email:
//           <input
//             type="text"
//             name="email"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             required
//           />
//           {formik.touched.email && formik.errors.email ? (
//             <div>{formik.errors.email}</div>
//           ) : null}
//         </label>
//         <label>
//           Location:
//           <input
//             type="text"
//             name="location"
//             value={formik.values.location}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             required
//           />
//           {formik.touched.location && formik.errors.location ? (
//             <div>{formik.errors.location}</div>
//           ) : null}
//         </label>
//         <label>
//           Notes:
//           <input
//             type="text"
//             name="notes"
//             value={formik.values.notes}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             required
//           />
//           {formik.touched.notes && formik.errors.notes ? (
//             <div>{formik.errors.notes}</div>
//           ) : null}
//         </label>

//         <button type="submit">Save Appointment</button>
//         <button type="button" onClick={onClose}>
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AppointmentPage;

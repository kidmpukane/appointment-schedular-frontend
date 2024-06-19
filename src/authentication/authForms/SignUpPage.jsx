import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../authProviders/AuthenticationProvider";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../authStyles/authStyles.css";

const SignupForm = () => {
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();
  const { authInfo, updateAuthInfo } = useContext(AuthenticationContext);

  return (
    <div className="form-container">
      <div className="form-view">
        <Formik
          initialValues={{
            email: "",
            password: "",
            re_password: "",
            agreeToTerms: false,
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .required("Password is required")
              .min(8, "Password is too short - should be 8 chars minimum")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                "Password must contain at least 8 characters, including one letter and one number"
              ),
            re_password: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Please confirm your password"),
            agreeToTerms: Yup.boolean().oneOf(
              [true],
              "Must Accept Terms and Conditions"
            ),
          })}
          onSubmit={async (values) => {
            try {
              const response = await axios.post(
                "http://127.0.0.1:8000/authentication/register/",
                values
              );
              updateAuthInfo({
                csrfToken: response.data.csrf_token,
                sessionId: response.data.sessionid,
                userId: response.data.user_id,
              });
              console.log("Signup successful:", response.data);
              if (response.data.csrf_token && response.data.sessionid) {
                navigate("/availability-registration-form", { replace: true });
                window.location.reload();
              }
            } catch (error) {
              console.error("Signup error:", error);
              setBackendError("An error occurred. Please try again later.");
            }
          }}
        >
          <Form>
            <Field name="email" type="email" as="input" placeholder="email" />
            <ErrorMessage
              name="email"
              component="div"
              className="error-message"
            />

            <Field
              name="password"
              type="password"
              as="input"
              placeholder="password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error-message"
            />

            <Field
              name="re_password"
              type="password"
              as="input"
              placeholder="confirm password"
            />
            <ErrorMessage
              name="re_password"
              component="div"
              className="error-message"
            />

            <label>
              <Field type="checkbox" name="agreeToTerms" /> I agree to the terms
              and conditions
            </label>
            <ErrorMessage
              name="agreeToTerms"
              component="div"
              className="error-message"
            />

            {backendError && (
              <div className="error-message">{backendError}</div>
            )}

            <button type="submit">Submit</button>

            <p>
              Already have an account? <Link to="/log-in">Login</Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;

import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../authProviders/AuthenticationProvider";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Cookies from "js-cookie";
import "../authStyles/authStyles.css";

import * as Yup from "yup";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const { authInfo, updateAuthInfo } = useContext(AuthenticationContext);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/authentication/csrf_cookie/"
        );
        if (response.status === 200) {
          const csrfToken = response.data.csrfToken;
          updateAuthInfo({ csrfToken });
          // console.log("CSRF token:", csrfToken);
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    getCsrfToken();
  }, []);

  const handleLogin = async (values) => {
    try {
      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/authentication/login/",
        values
      );

      updateAuthInfo({
        csrfToken: loginResponse.data.csrf_token,
        sessionId: loginResponse.data.sessionid,
        userId: loginResponse.data.user_id,
      });
      if (loginResponse.data.csrf_token && loginResponse.data.sessionid) {
        window.location.reload() && navigate("/");
      }
    } catch (error) {
      console.error(error);
      let backendErrorMessage = "An error occurred. Please try again later.";
      if (error.response && error.response.data) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            backendErrorMessage =
              "Invalid request. Please check your input and try again.";
            break;
          case 401:
            backendErrorMessage =
              "Unauthorized. Please check your credentials and try again.";
            break;
          case 403:
            backendErrorMessage =
              "Forbidden. You don't have permission to access this resource.";
            break;
          case 404:
            backendErrorMessage =
              "Resource not found. Please check the URL and try again.";
            break;
          default:
            break;
        }
      }
      setBackendError(backendErrorMessage);
    }
  };

  return (
    <div className="form-container">
      <div className="form-view">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={handleLogin}
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

            <button type="submit">Login</button>
            {backendError && (
              <div className="error-message">{backendError}</div>
            )}
            <p>
              Don't have an account? <Link to="/registration">Sign Up</Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;

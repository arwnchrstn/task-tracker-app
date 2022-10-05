import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import { errorToast } from "../config/toastNotification";
import { loginValidation } from "../schemas/loginValidation";
import ButtonTheme from "../components//buttons/ButtonTheme";
import useSetActivities from "../hooks/useSetActivities";
import useSetUser from "../hooks/useSetUser";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setActivities = useSetActivities();
  const setUser = useSetUser();

  //submit form
  const onSubmit = async (values, action) => {
    try {
      const loginData = values;
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/login",
        loginData
      );

      if (response.status === 200) {
        action.setSubmitting(false);
        action.resetForm();

        //set user state
        setUser(
          response.data.username,
          response.data.email,
          response.data.isVerified,
          response.data.dateCreated
        );
        setActivities(response.data.activities);
        setShowPassword(false);

        //redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      //catch error based on status codes
      if (error.response.status === 400 || error.response.status === 500)
        errorToast(error.response.data);
      else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }

      action.setFieldValue("password", "");
    } finally {
      action.setFieldTouched(false);
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Task Tracker App</title>
        </Helmet>
      </HelmetProvider>

      <Formik
        initialValues={{ emailUsername: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={loginValidation}
      >
        {(props) => (
          <Form className="mb-3 shadow px-3 py-4 rounded bg-white">
            <h4 className="mb-3 text-center fw-bold text-accent-theme d-none d-md-block">
              Login
            </h4>

            <fieldset disabled={props.isSubmitting}>
              <Field
                type="text"
                name="emailUsername"
                className={`form-control ${
                  props.touched.emailUsername && props.errors.emailUsername
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Email or Username"
              />
              <div className="invalid-feedback">
                {props.touched.emailUsername && props.errors.emailUsername}
              </div>

              <Field
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                className={`form-control mt-3 ${
                  props.touched.password && props.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Password"
              />
              <div className="invalid-feedback">
                {props.touched.password && props.errors.password}
              </div>

              <div className="d-flex align-items-center mt-2">
                <input
                  type="checkbox"
                  id="show-pwd-login"
                  className="me-1"
                  onChange={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  className="text-accent-theme"
                  htmlFor="show-pwd-login"
                  style={{ cursor: "pointer" }}
                >
                  Show Password
                </label>
              </div>

              <ButtonTheme
                property="form-control fw-bold text-white mt-4"
                type="submit"
              >
                {props.isSubmitting ? (
                  <>
                    Please wait...
                    <Spinner animation="border" variant="light" size="sm" />
                  </>
                ) : (
                  "Login"
                )}
              </ButtonTheme>
            </fieldset>

            <div className="text-center">
              <Link
                to={`${props.isSubmitting ? "#" : "/signup"}`}
                className="d-inline-block text-theme mt-3"
              >
                Create An Account
              </Link>
              <br />
              <Link
                to={`${props.isSubmitting ? "#" : "/forgot-password"}`}
                className="d-inline-block text-theme mt-1"
              >
                Forgot Password
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;

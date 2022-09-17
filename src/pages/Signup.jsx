import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import { signupValidation } from "../schemas/signupValidation";
import { errorToast, successToast } from "../config/toastNotification";
import ButtonTheme from "../components//buttons/ButtonTheme";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  //submit form
  const onSubmit = async (values, action) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/api/users/signup",
        values
      );

      if (response.status === 200) {
        setFormErrors({});
        setShowPassword(false);
        action.setSubmitting(false);
        action.resetForm();
        navigate("/");
        successToast(
          `An email was sent to ${response.data}. Please check your inbox or spam folders.`
        );
      }
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        errorToast(error.response.data);
      } else if (error.response.status === 424) {
        navigate("/");
        successToast(error.response.data);
      } else if (error.response.status === 409) {
        setFormErrors(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Create Account</title>
        </Helmet>
      </HelmetProvider>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        }}
        onSubmit={onSubmit}
        validationSchema={signupValidation}
      >
        {(props) => (
          <Form className="mb-3 shadow px-3 py-4 rounded bg-white">
            <h4 className="text-center fw-bold text-accent-theme d-none d-md-block mb-3">
              Create Account
            </h4>

            <fieldset disabled={props.isSubmitting}>
              <Field
                type="text"
                name="username"
                className={`form-control ${
                  (props.errors.username && props.touched.username) ||
                  formErrors?.errorUsername
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Username"
                onInput={() =>
                  setFormErrors((prev) => ({ ...prev, errorUsername: "" }))
                }
                required
              />
              <div className="invalid-feedback">
                {props.touched.username && props.errors.username}
                {formErrors?.errorUsername}
              </div>

              <Field
                type="email"
                name="email"
                className={`form-control mt-3 ${
                  (props.errors.email && props.touched.email) ||
                  formErrors?.errorEmail
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Email Address"
                onInput={() =>
                  setFormErrors((prev) => ({ ...prev, errorEmail: "" }))
                }
                required
              />
              <div className="invalid-feedback">
                {props.touched.email && props.errors.email}
                {formErrors?.errorEmail}
              </div>

              <Field
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                className={`form-control mt-3 ${
                  props.errors.password && props.touched.password
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Password"
                required
              />
              <div className="invalid-feedback">
                {props.touched.password && props.errors.password}
              </div>

              <Field
                type={`${showPassword ? "text" : "password"}`}
                name="confirmPassword"
                className={`form-control mt-3 ${
                  (props.errors.confirmPassword &&
                    props.touched.confirmPassword) ||
                  formErrors?.errorPassword
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Confirm Password"
                required
              />
              <div className="invalid-feedback">
                {props.touched.confirmPassword && props.errors.confirmPassword}
                {formErrors?.errorPassword}
              </div>

              <div className="d-flex align-items-center mt-2">
                <input
                  type="checkbox"
                  id="show-pwd-signup"
                  className="me-1"
                  onChange={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
                <label
                  className="text-accent-theme"
                  htmlFor="show-pwd-signup"
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
                  "Signup"
                )}
              </ButtonTheme>
            </fieldset>

            <div className="text-center">
              <Link
                to={props.isSubmitting ? "#" : "/"}
                className="d-inline-block text-theme mt-3"
                disabled
              >
                Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;

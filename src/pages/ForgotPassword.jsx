import React from "react";

import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import { resetPasswordValidation } from "../schemas/resetPasswordValidation";
import ButtonTheme from "../components/buttons/ButtonTheme";
import { errorToast, successToast } from "../config/toastNotification";

const ForgotPassword = () => {
  //submit form
  const onSubmit = async (values, action) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/forgot-password",
        values
      );

      if (response.status === 200) {
        successToast(response.data);
      }
    } catch (error) {
      if (
        error.response.status === 500 ||
        error.response.status === 400 ||
        error.response.status === 404
      ) {
        errorToast(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    } finally {
      action.resetForm();
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Forgot Password</title>
        </Helmet>
      </HelmetProvider>

      <Formik
        initialValues={{ emailUsername: "" }}
        onSubmit={onSubmit}
        validationSchema={resetPasswordValidation}
      >
        {(props) => (
          <Form className="mb-3 shadow px-3 py-4 rounded bg-white">
            <h4 className="mb-3 text-center fw-bold text-accent-theme d-none d-md-block">
              Forgot Password
            </h4>

            <fieldset disabled={props.isSubmitting}>
              <Field
                type="text"
                name="emailUsername"
                className={`form-control ${
                  props.errors.emailUsername && props.touched.emailUsername
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Email or Username"
                required
              />
              <div className="invalid-feedback">
                {props.touched.emailUsername && props.errors.emailUsername}
              </div>

              <ButtonTheme
                property="form-control fw-bold text-white mt-4"
                type="submit"
              >
                {props.isSubmitting ? (
                  <>
                    Please wait... <Spinner animation="border" size="sm" />
                  </>
                ) : (
                  "Reset Password"
                )}
              </ButtonTheme>
            </fieldset>

            <div className="text-center">
              <Link to="/" className="d-inline-block text-theme mt-3">
                Login
              </Link>
              <br />
              <Link to="/signup" className="d-inline-block text-theme mt-1">
                Create An Account
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPassword;

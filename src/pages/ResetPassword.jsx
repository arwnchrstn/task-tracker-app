import React, { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { errorToast } from "../config/toastNotification";
import axios from "axios";

import { newPasswordValidation } from "../schemas/newPasswordValidation";
import ButtonTheme from "../components/buttons/ButtonTheme";
import invalid from "../assets/invalid.svg";
import verified from "../assets/verified.svg";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [successChange, setSuccessChange] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const validateToken = useRef();

  //validate token function here
  validateToken.current = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER +
          `/api/users/forgot-password/validate/${resetToken}`
      );

      if (response.status === 200) {
        setIsTokenValid(true);
      }
    } catch (error) {
      setIsTokenValid(false);
      console.error(`${error.response.status} / ${error.response.data}`);
    } finally {
      setIsLoading(false);
    }
  };

  //submit new password
  const submitNewPassword = async (values, action) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          `/api/users/forgot-password/update/${resetToken}`,
        { newPassword: values.newPassword }
      );

      if (response.status === 200) {
        setSuccessChange(true);
        setShowPassword(false);
      }
    } catch (error) {
      errorToast(error.response.data || error.message);
      console.error(`${error.response.status} / ${error.response.data}`);
    } finally {
      action.resetForm();
    }
  };

  useEffect(() => {
    validateToken.current();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Reset Password</title>
        </Helmet>
      </HelmetProvider>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            {isLoading ? (
              <h2 className="text-theme fw-bold text-center">
                Loading... <Spinner className="ms-1" animation="border" />
              </h2>
            ) : (
              <>
                {isTokenValid === true && successChange === false && (
                  <>
                    <h3 className="text-theme fw-bold">
                      TakaTask Password Reset
                    </h3>

                    <Formik
                      initialValues={{
                        newPassword: "",
                        confirmNewPassword: ""
                      }}
                      onSubmit={submitNewPassword}
                      validationSchema={newPasswordValidation}
                    >
                      {(props) => (
                        <Form>
                          <fieldset
                            disabled={props.isSubmitting}
                            className="mt-4"
                          >
                            <label htmlFor="new-pass" className="ms-1 fw-bold">
                              Enter new password
                            </label>
                            <Field
                              type={`${showPassword ? "text" : "password"}`}
                              name="newPassword"
                              id="new-pass"
                              className={`form-control ${
                                props.touched.newPassword &&
                                props.errors.newPassword
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <div className="invalid-feedback">
                              {props.touched.newPassword &&
                                props.errors.newPassword}
                            </div>

                            <label
                              htmlFor="confirm-new-pass"
                              className="ms-1 mt-3 fw-bold"
                            >
                              Confirm new password
                            </label>
                            <Field
                              type={`${showPassword ? "text" : "password"}`}
                              name="confirmNewPassword"
                              id="confirm-new-pass"
                              className={`form-control ${
                                props.touched.confirmNewPassword &&
                                props.errors.confirmNewPassword
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <div className="invalid-feedback">
                              {props.touched.confirmNewPassword &&
                                props.errors.confirmNewPassword}
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
                              property="text-white fw-bold mt-4 form-control"
                              type="submit"
                            >
                              {props.isSubmitting ? (
                                <>
                                  Changing Password...
                                  <Spinner
                                    animation="border"
                                    variant="light"
                                    size="sm"
                                  />
                                </>
                              ) : (
                                "Change Password"
                              )}
                            </ButtonTheme>
                          </fieldset>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}

                {isTokenValid === false && successChange === false && (
                  <>
                    <img
                      src={invalid}
                      alt="invalid token"
                      className="img-fluid mx-auto d-block"
                      style={{
                        width: "55%",
                        minWidth: "120px",
                        maxWidth: "250px"
                      }}
                    />
                    <h4 className="fw-bold text-theme mt-5">
                      This reset password link is invalid or already used
                    </h4>

                    <ButtonTheme
                      property="mt-3 text-white fw-bold px-4 d-block mx-auto"
                      onClick={() => navigate("/")}
                    >
                      Back to Login
                    </ButtonTheme>
                  </>
                )}
              </>
            )}

            {successChange === true && (
              <>
                <img
                  src={verified}
                  alt="success change"
                  className="img-fluid mx-auto d-block"
                  style={{
                    width: "55%",
                    minWidth: "120px",
                    maxWidth: "250px"
                  }}
                />
                <h4 className="fw-bold text-theme mt-5 text-center">
                  Password changed, you may now login to your account
                </h4>

                <ButtonTheme
                  property="mt-3 text-white fw-bold px-4 d-block mx-auto"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </ButtonTheme>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

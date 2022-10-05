import React, { useState } from "react";

import { FaUserAlt } from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import { errorToast, successToast } from "../config/toastNotification";
import axios from "axios";

import { dateToStringDateTime } from "../config/dateConverter";
import { editUsernameValidation } from "../schemas/editUsernameValidation";
import { editEmailValidation } from "../schemas/editEmailValidation";
import { changePasswordValidation } from "../schemas/changePasswordValidation";
import { deleteAccountValidation } from "../schemas/deleteAccountValidation";
import ButtonTheme from "../components/buttons/ButtonTheme";
import useSetUser from "../hooks/useSetUser";
import useResetAllState from "../hooks/useResetAllState";

const Profile = () => {
  const profile = useSelector((state) => state.user);
  const [isResending, setIsResending] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const setUser = useSetUser();
  const resetAllState = useResetAllState();
  const navigate = useNavigate();

  //resend email
  const resendEmail = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_VERIFY_ENDPOINT +
          "/resend/verification",
        { email: profile?.email }
      );

      if (response.status === 200) {
        successToast(`An email was sent to ${profile?.email}`);
      }
    } catch (error) {
      if (
        error.response.status === 400 ||
        error.response.status === 409 ||
        error.response.status === 500
      ) {
        if (error.response.status === 409) {
          errorToast(error.response.data);
          setUser(
            profile?.username,
            profile?.email,
            true,
            profile?.dateCreated
          );
          return;
        }
        errorToast(error.response.data);
      } else if (error.response.status === 401) {
        resetAllState();
        navigate("/");
      } else if (error.response.status === 403) {
        resetAllState();
        navigate("/");
        errorToast(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    } finally {
      setIsResending(false);
    }
  };

  //handle change username
  const editUsername = async (values, action) => {
    if (values.username === profile?.username) {
      setIsUsernameEditable(false);
      return;
    }

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/edit-username",
        values
      );

      if (response.status === 200) {
        setUser(
          response.data.username,
          response.data.email,
          response.data.isVerified,
          response.data.dateCreated
        );
        successToast("Username updated");
        setIsUsernameEditable(false);
      }
    } catch (error) {
      if (error.response.status === 500 || error.response.status === 400) {
        errorToast(error.response.data);
      } else if (error.response.status === 401) {
        resetAllState();
        navigate("/");
      } else if (error.response.status === 403) {
        resetAllState();
        navigate("/");
        errorToast(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    }
  };

  //handle change email
  const changeEmail = async (values, action) => {
    if (values.email === profile?.email) {
      setIsEmailEditable(false);
      return;
    }

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/change-email",
        values
      );

      if (response.status === 200) {
        setUser(
          response.data.username,
          response.data.email,
          response.data.isVerified,
          response.data.dateCreated
        );
        successToast("Email changed");
        setIsEmailEditable(false);
      }
    } catch (error) {
      if (error.response.status === 500 || error.response.status === 400) {
        errorToast(error.response.data);
      } else if (error.response.status === 401) {
        resetAllState();
        navigate("/");
      } else if (error.response.status === 403) {
        resetAllState();
        navigate("/");
        errorToast(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    }
  };

  //handle change password
  const changePassword = async (values, action) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/change-password",
        {
          newPassword: values.newPassword,
          currentPassword: values.currentPassword
        }
      );

      if (response.status === 200) {
        setShowChangePassword(false);
        successToast(response.data);
      }
    } catch (error) {
      if (error.response.status === 500 || error.response.status === 400) {
        errorToast(error.response.data);
      } else if (error.response.status === 401) {
        resetAllState();
        navigate("/");
      } else if (error.response.status === 403) {
        resetAllState();
        navigate("/");
        errorToast(error.response.data);
      } else {
        errorToast(error.message || error.response.data);
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    }
  };

  //handle delete account
  const deleteAccount = async (values, action) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER +
          process.env.REACT_APP_USER_ENDPOINT +
          "/delete",
        { confirmPassword: values.confirmPassword }
      );

      if (response.status === 200) {
        setShowChangePassword(false);
        resetAllState();
        navigate("/");
        successToast(response.data);
      }
    } catch (error) {
      if (error.response.status === 500 || error.response.status === 400) {
        errorToast(error.response.data);
      } else if (error.response.status === 401) {
        resetAllState();
        navigate("/");
      } else if (error.response.status === 403) {
        resetAllState();
        navigate("/");
        errorToast(error.response.data);
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
          <title>TakaTask | Profile</title>
        </Helmet>
      </HelmetProvider>

      <div className="container-fluid content-container h-100 p-4 pb-5">
        <h3 className="text-theme fw-bold mb-4">TakaTask Profile</h3>

        <p className="fw-bold mb-1 d-flex align-items-center">
          <FaUserAlt className="me-1" /> Username:
        </p>
        {isUsernameEditable && (
          <Formik
            initialValues={{ username: profile?.username }}
            onSubmit={editUsername}
            validationSchema={editUsernameValidation}
          >
            {(props) => (
              <Form>
                <fieldset disabled={props.isSubmitting}>
                  <div>
                    <Field
                      type="text"
                      name="username"
                      className={`form-control ${
                        props.errors.username && props.touched.username
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{ width: "initial" }}
                    />
                    <h6
                      className={`m-0 ${!props.isSubmitting ? "d-none" : ""}`}
                    >
                      Please wait... <Spinner animation="border" size="sm" />
                    </h6>
                    <div className="invalid-feedback">
                      {props.touched.username && props.errors.username}
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm mt-1 rounded"
                    onClick={() => setIsUsernameEditable(false)}
                    type="button"
                  >
                    <AiFillCloseCircle size={20} />
                  </button>
                  <button
                    className="btn btn-success btn-sm mt-1 ms-1 rounded"
                    type="submit"
                  >
                    <AiFillCheckCircle size={20} />
                  </button>
                </fieldset>
              </Form>
            )}
          </Formik>
        )}
        {!isUsernameEditable && (
          <>
            <h4 className="text-theme fw-bold">{profile?.username}</h4>
            <button
              className="btn btn-success btn-sm d-block px-3 mb-2 rounded"
              onClick={() => setIsUsernameEditable(true)}
            >
              Edit username
            </button>
          </>
        )}

        <p className="fw-bold mt-5 mb-1 d-flex align-items-center">
          <MdEmail className="me-1" /> Email address:
        </p>
        {isEmailEditable && (
          <Formik
            initialValues={{ email: profile?.email }}
            onSubmit={changeEmail}
            validationSchema={editEmailValidation}
          >
            {(props) => (
              <Form>
                <fieldset disabled={props.isSubmitting}>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      className={`form-control ${
                        props.errors.email && props.touched.email
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{ width: "initial" }}
                    />
                    <h6
                      className={`m-0 ${!props.isSubmitting ? "d-none" : ""}`}
                    >
                      Please wait... <Spinner animation="border" size="sm" />
                    </h6>
                    <div className="invalid-feedback">
                      {props.touched.email && props.errors.email}
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm mt-1 rounded"
                    onClick={() => setIsEmailEditable(false)}
                    type="button"
                  >
                    <AiFillCloseCircle size={20} />
                  </button>
                  <button
                    className="btn btn-success btn-sm mt-1 ms-1 rounded"
                    type="submit"
                  >
                    <AiFillCheckCircle size={20} />
                  </button>
                </fieldset>
              </Form>
            )}
          </Formik>
        )}
        {!isEmailEditable && (
          <>
            {!profile?.isVerified ? (
              <span className="badge bg-warning text-dark">Not verified</span>
            ) : (
              <span className="badge bg-success">Verified</span>
            )}
            <h4 className="text-theme fw-bold">{profile?.email}</h4>
            <button
              className="btn btn-success btn-sm d-block px-3 mb-2 rounded"
              onClick={() => setIsEmailEditable(true)}
            >
              Change email
            </button>
            {!profile?.isVerified && (
              <ButtonTheme
                property="text-white px-3 btn-sm"
                onClick={resendEmail}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    Please wait... <Spinner animation="border" size="sm" />
                  </>
                ) : (
                  "Resend verification"
                )}
              </ButtonTheme>
            )}
          </>
        )}

        <p className="fw-bold mt-5 mb-1 d-flex align-items-center">
          <MdDateRange className="me-1" /> Account created:
        </p>
        <h4 className="text-theme fw-bold">
          {dateToStringDateTime(new Date(profile?.dateCreated))}
        </h4>

        <ButtonTheme
          property="btn-sm mt-5 px-3 d-block text-white"
          onClick={() => setShowChangePassword(true)}
        >
          Change password
        </ButtonTheme>
        <button
          className="btn btn-danger btn-sm mt-1 px-3 rounded"
          onClick={() => setShowDeleteAccount(true)}
        >
          Delete my account
        </button>
      </div>

      {/* Modal for changing password */}
      <Modal
        show={showChangePassword}
        onHide={() => {
          setShowChangePassword(false);
          setShowPassword(false);
        }}
      >
        <Modal.Body>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
              confirmation: ""
            }}
            onSubmit={changePassword}
            validationSchema={changePasswordValidation}
          >
            {(props) => (
              <Form>
                <fieldset disabled={props.isSubmitting}>
                  <label htmlFor="current-pass" className="ms-1 fw-bold">
                    Type your current password
                  </label>
                  <Field
                    type={`${showPassword ? "text" : "password"}`}
                    name="currentPassword"
                    className={`form-control ${
                      props.touched.currentPassword && [
                        props.errors.currentPassword ? "is-invalid" : ""
                      ]
                    }`}
                    id="current-pass"
                  />
                  <div className="invalid-feedback">
                    {props.touched.currentPassword &&
                      props.errors.currentPassword}
                  </div>

                  <label htmlFor="new-pass" className="ms-1 fw-bold mt-2">
                    New password
                  </label>
                  <Field
                    type={`${showPassword ? "text" : "password"}`}
                    name="newPassword"
                    className={`form-control ${
                      props.touched.newPassword && [
                        props.errors.newPassword ? "is-invalid" : ""
                      ]
                    }`}
                    id="new-pass"
                  />
                  <div className="invalid-feedback">
                    {props.touched.newPassword && props.errors.newPassword}
                  </div>

                  <label
                    htmlFor="confirm-new-pass"
                    className="ms-1 fw-bold mt-2"
                  >
                    Confirm new password
                  </label>
                  <Field
                    type={`${showPassword ? "text" : "password"}`}
                    name="confirmNewPassword"
                    className={`form-control ${
                      props.touched.confirmNewPassword && [
                        props.errors.confirmNewPassword ? "is-invalid" : ""
                      ]
                    }`}
                    id="confirm-new-pass"
                  />
                  <div className="invalid-feedback">
                    {props.touched.confirmNewPassword &&
                      props.errors.confirmNewPassword}
                  </div>

                  <div className="d-flex align-items-center mt-2 ms-1">
                    <input
                      type="checkbox"
                      id="show-pwd-change"
                      className="me-1"
                      onChange={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="text-accent-theme"
                      htmlFor="show-pwd-change"
                      style={{ cursor: "pointer" }}
                    >
                      Show Password
                    </label>
                  </div>

                  <label
                    htmlFor="change-confirmation"
                    className="ms-1 fw-bold mt-3"
                  >
                    Please type{" "}
                    <span className="text-danger">/change password</span> to
                    continue
                  </label>
                  <Field
                    type="text"
                    name="confirmation"
                    className={`form-control ${
                      props.touched.confirmation && [
                        props.errors.confirmation ? "is-invalid" : ""
                      ]
                    }`}
                    id="change-confirmation"
                  />
                  <div className="invalid-feedback">
                    {props.touched.confirmation && props.errors.confirmation}
                  </div>

                  <div className="row mt-4 justify-content-center">
                    <div className="col-md-4 order-2 order-md-1 mt-2 mt-md-0">
                      <button
                        className="btn btn-danger form-control rounded"
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="col-md-4 order-1 order-md-2">
                      <ButtonTheme
                        property="text-white form-control"
                        type="submit"
                      >
                        {props.isSubmitting ? (
                          <>
                            Please wait...
                            <Spinner
                              animation="border"
                              variant="light"
                              size="sm"
                            />
                          </>
                        ) : (
                          "Change"
                        )}
                      </ButtonTheme>
                    </div>
                  </div>
                </fieldset>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal for deleting account */}
      <Modal
        show={showDeleteAccount}
        onHide={() => setShowDeleteAccount(false)}
      >
        <Modal.Body>
          <h5>
            Please beware that this action will permanently delete your account.
            Please proceed with caution,{" "}
            <span className="fw-bold text-danger">
              this action is irreversible and cannot be undone
            </span>
            .
          </h5>

          <Formik
            initialValues={{ confirmPassword: "", confirmation: "" }}
            onSubmit={deleteAccount}
            validationSchema={deleteAccountValidation}
          >
            {(props) => (
              <Form>
                <fieldset disabled={props.isSubmitting}>
                  <label htmlFor="confirm-pass" className="fw-bold ms-1 mt-3">
                    Type your password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirm-pass"
                    className={`form-control ${
                      props.touched.confirmPassword &&
                      props.errors.confirmPassword
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {props.touched.confirmPassword &&
                      props.errors.confirmPassword}
                  </div>

                  <label htmlFor="confirm-delete" className="fw-bold ms-1 mt-3">
                    Please type{" "}
                    <span className="text-danger">/delete my account</span> to
                    continue
                  </label>
                  <Field
                    type="text"
                    name="confirmation"
                    id="confirm-delete"
                    className={`form-control ${
                      props.touched.confirmation && props.errors.confirmation
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {props.touched.confirmation && props.errors.confirmation}
                  </div>

                  <div className="row mt-4 justify-content-center">
                    <div className="col-md-4 order-2 order-md-1 mt-2 mt-md-0">
                      <button
                        className="btn btn-danger form-control rounded"
                        type="button"
                        onClick={() => setShowDeleteAccount(false)}
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="col-md-4 order-1 order-md-2">
                      <ButtonTheme
                        property="text-white form-control"
                        type="submit"
                      >
                        {props.isSubmitting ? (
                          <>
                            Please wait...
                            <Spinner
                              animation="border"
                              variant="light"
                              size="sm"
                            />
                          </>
                        ) : (
                          "Delete"
                        )}
                      </ButtonTheme>
                    </div>
                  </div>
                </fieldset>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile;

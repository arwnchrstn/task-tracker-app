import React, { useEffect, useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import { IoLogOut } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import ButtonTheme from "./buttons/ButtonTheme";
import ButtonSecondary from "./buttons/ButtonSecondary";
import { errorToast, successToast } from "../config/toastNotification";
import { categoryValidation } from "../schemas/categoryValidation";
import { parentVariant, childVariant } from "../config/framerMotionVariants";
import useResetAllState from "../hooks/useResetAllState";
import useSetActivities from "../hooks/useSetActivities";
import useSetTasks from "../hooks/useSetTasks";

const Sidebar = ({ isSidebarActive, setIsSidebarActive }) => {
  const userState = useSelector((state) => state.user);
  const taskState = useSelector((state) => state.categories);
  const pwa = useSelector((state) => state.pwa);
  const [modalShow, setModalShow] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [isDismissable, setIsDismissable] = useState(true);
  const navigate = useNavigate();
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();
  const getCategories = useRef();

  //get all categories from user
  getCategories.current = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER + "/api/categories"
      );

      if (response.status === 200) {
        setTasks(response.data.categories, response.data.totalCount);
      }
    } catch (error) {
      if (error.response.status === 500) {
        errorToast(error.response.data);
      } else {
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    }
  };

  //logout function
  const logout = async () => {
    setShowModalLogout(true);
    setIsSidebarActive(!isSidebarActive);

    try {
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER + "/api/users/logout"
      );

      if (response.status === 200) {
        resetAllState();
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.error(
          `${error.response.status} / ${error.response.statusText}`
        );
        resetAllState();
        navigate("/");
      } else {
        console.error(`${error.response.status} / ${error.response.data}`);
        resetAllState();
        navigate("/");
      }
    } finally {
      setShowModalLogout(false);
    }
  };

  //onsubmit function
  const onSubmit = async (values, action) => {
    try {
      setIsDismissable(false);
      const response = await axios.post(
        process.env.REACT_APP_API_SERVER + "/api/categories/add",
        values
      );

      if (response.status === 200) {
        setTasks(response.data.categories, response.data.totalCount);
        setActivities(response.data.activities);
        successToast("New category added");
        setModalShow(false);
        action.resetForm();
      }
    } catch (error) {
      if (error.response.status === 500) {
        errorToast(error.response.data);

        setModalShow(false);
        action.resetForm();
      } else if (error.response.status === 400) {
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
        setModalShow(false);
        action.resetForm();
        console.error(`${error.response.status} / ${error.response.data}`);
      }
    } finally {
      setIsDismissable(true);
      action.setSubmitting(false);
    }
  };

  //Trigger install prompt
  const handleInstall = (evt) => {
    evt.preventDefault();
    if (!pwa.promptInstall) {
      return;
    }
    pwa.promptInstall.prompt();
  };

  useEffect(() => {
    getCategories.current();
  }, []);

  useEffect(() => {
    if (isSidebarActive) document.body.classList.add("disable-body-scroll");
    else document.body.classList.remove("disable-body-scroll");
  }, [isSidebarActive]);

  return (
    <>
      <div
        className={`sidebar d-flex flex-column p-3 h-100 bg-accent-theme ${
          isSidebarActive ? "active" : ""
        }`}
      >
        <div className="sidebar-header">
          <p
            className="text-end d-block d-md-none"
            onClick={() => setIsSidebarActive(!isSidebarActive)}
            style={{ cursor: "pointer" }}
          >
            <AiOutlineClose size={30} />
          </p>

          {pwa.isSupported === true && (
            <button
              className="btn btn-outline-light px-4 btn-sm d-block mx-auto mb-3"
              onClick={handleInstall}
              onFocus={(e) => e.target.blur()}
            >
              Install App
            </button>
          )}

          {!userState?.isVerified && (
            <span className="badge bg-warning text-dark text-start text-wrap mb-2 p-2">
              Your email is not verified. Check your inbox or spam for email
              verification or go to Profile to resend email.
            </span>
          )}

          <p className="text-theme fw-bold m-0 fs-6">
            Welcome, {userState?.username}!
          </p>
          <small className="text-secondary-theme">{userState?.email}</small>
        </div>

        <div className="sidebar-body my-4">
          <Link
            to="/dashboard"
            onClick={() => setIsSidebarActive(!isSidebarActive)}
            className="border border-1 border-light px-3 rounded mb-2 d-block navlink text-secondary-theme text-decoration-none text-center mb-4"
          >
            Dashboard
          </Link>

          <p className="text-secondary-theme text-center fw-bold mb-2 fs-6">
            List of categories
          </p>

          {!taskState.categories && (
            <span className="text-center d-block">
              Loading... <Spinner animation="border" size="sm" />
            </span>
          )}

          {taskState.categories?.length === 0 && (
            <>
              <small className="text-secondary-theme m-0 d-block">
                You have not created any categories yet. Start adding a category
                to add your tasks.
              </small>
            </>
          )}

          <motion.div
            variants={parentVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AnimatePresence>
              {taskState.categories?.length !== 0 &&
                taskState.categories?.map((task) => (
                  <Link
                    to={`/category/${task._id}`}
                    key={task._id}
                    onClick={() => setIsSidebarActive(!isSidebarActive)}
                    className="px-3 mb-1 rounded d-block navlink text-secondary-theme text-decoration-none text-capitalize"
                  >
                    <motion.p variants={childVariant} className="mb-1">
                      &#9679; {task.name}
                    </motion.p>
                  </Link>
                ))}
            </AnimatePresence>
          </motion.div>

          <ButtonTheme
            property="text-accent btn-sm mt-3 d-block mx-auto px-3 fw-bold"
            onClick={() => setModalShow(true)}
          >
            Add new category
          </ButtonTheme>
        </div>
        <div className="sidebar-footer mt-auto">
          <Link
            to="/profile"
            onClick={() => setIsSidebarActive(!isSidebarActive)}
          >
            <ButtonTheme property="btn-sm form-control fw-bold text-accent mb-2 position-relative">
              Profile
              {!userState.isVerified && (
                <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger rounded-circle">
                  <span className="visually-hidden">Unverified email</span>
                </span>
              )}
            </ButtonTheme>
          </Link>
          <ButtonSecondary
            property="btn-sm form-control fw-bold text-accent mb-4"
            onClick={logout}
          >
            Logout <IoLogOut size={20} className="ms-1" />
          </ButtonSecondary>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        backdrop={isDismissable ? true : "static"}
      >
        <Modal.Body>
          <h5 className="text-accent fw-bold text-center mb-4">
            Add new category
          </h5>

          <Formik
            initialValues={{
              name: ""
            }}
            onSubmit={onSubmit}
            validationSchema={categoryValidation}
          >
            {(props) => (
              <>
                <Form>
                  <fieldset disabled={props.isSubmitting}>
                    <Field
                      type="text"
                      name="name"
                      className={`form-control ${
                        props.errors.name && props.touched.name
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Category name"
                    />
                    <div className="invalid-feedback">
                      {props.touched.name && props.errors.name}
                    </div>

                    <div className="row mt-4 justify-content-center">
                      <div className="col-md-4 order-2 order-md-1 mt-2 mt-md-0">
                        <button
                          className="btn btn-danger form-control rounded"
                          onClick={() => setModalShow(false)}
                          type="button"
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
                            "Add"
                          )}
                        </ButtonTheme>
                      </div>
                    </div>
                  </fieldset>
                </Form>
              </>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {/* Modal for logout */}
      <Modal show={showModalLogout} backdrop="static" centered>
        <Modal.Body>
          <h2 className="text-theme text-center fw-bold my-4">
            Signing Out <Spinner className="ms-1" animation="border" />
          </h2>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Sidebar;

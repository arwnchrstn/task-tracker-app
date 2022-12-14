import React from "react";

import { Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";

import { taskValidation } from "../../schemas/taskValidation";
import { errorToast, successToast } from "../../config/toastNotification";
import { dateToYYYYMMDD } from "../../config/dateConverter";
import useResetAllState from "../../hooks/useResetAllState";
import useSetActivities from "../../hooks/useSetActivities";
import useSetTasks from "../../hooks/useSetTasks";
import ButtonTheme from "../buttons/ButtonTheme";

const AddCategory = ({
  showAddTask,
  isDismissableAdd,
  setShowAddTask,
  setIsDismissableAdd
}) => {
  const { id } = useParams("id");
  const navigate = useNavigate();
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();

  //submit handler for adding a new task
  const onSubmit = async (values, action) => {
    setIsDismissableAdd(false);
    try {
      const { time, ...data } = values;
      const formData = {
        ...data,
        dueDate: values.dueDate
          ? new Date(values.dueDate + " " + values.time)
          : ""
      };

      //check if due date is valid
      if (formData.dueDate && formData.dueDate < new Date())
        return errorToast("Invalid due date. Due date cannot be in the past");

      const response = await axios.post(
        process.env.REACT_APP_API_SERVER +
          `${process.env.REACT_APP_CATEGORY_ENDPOINT}/${id}/addtask`,
        formData
      );

      if (response.status === 200) {
        //set new tasks and recent activities to the redux store
        setActivities(response.data.activities);
        setTasks(response.data.categories, response.data.totalCount);
        setShowAddTask(false);
        successToast("New task added");
        action.resetForm();
      }
    } catch (error) {
      if (
        error.response.status === 500 ||
        error.response.status === 404 ||
        error.response.status === 400
      )
        errorToast(error.response.data);
      else if (error.response.status === 401) {
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
      action.setSubmitting(false);
      setIsDismissableAdd(true);
    }
  };

  return (
    <>
      {/* Modal for add a new task */}
      <Modal
        show={showAddTask}
        onHide={() => setShowAddTask(false)}
        backdrop={isDismissableAdd ? true : "static"}
      >
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              description: "",
              priority: "1",
              dueDate: "",
              time: ""
            }}
            onSubmit={onSubmit}
            validationSchema={taskValidation}
          >
            {(props) => (
              <fieldset disabled={props.isSubmitting}>
                <Form>
                  <label htmlFor="task-name" className="fw-bold ms-1">
                    Task name
                  </label>
                  <Field
                    id="task-name"
                    type="text"
                    name="name"
                    className={`form-control ${
                      props.touched.name && props.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {props.touched.name && props.errors.name}
                  </div>

                  <label
                    htmlFor="task-description"
                    className="fw-bold ms-1 mt-2"
                  >
                    Description (Optional)
                  </label>
                  <Field
                    as="textarea"
                    rows={5}
                    id="task-description"
                    type="text"
                    name="description"
                    className={`form-control ${
                      props.touched.description && props.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {props.touched.description && props.errors.description}
                  </div>

                  <label htmlFor="task-priority" className="fw-bold ms-1 mt-2">
                    Priority Level
                  </label>
                  <Field
                    as="select"
                    name="priority"
                    className={`form-select ${
                      props.touched.priority && props.errors.priority
                        ? "is-invalid"
                        : ""
                    }`}
                    id="task-priority"
                  >
                    <option value="1">Low Priority (Default)</option>
                    <option value="2">Medium Priority</option>
                    <option value="3">High Priority</option>
                  </Field>
                  <div className="invalid-feedback">
                    {props.touched.priority && props.errors.priority}
                  </div>

                  <label htmlFor="task-date" className="fw-bold ms-1 mt-2">
                    Due Date
                  </label>
                  <Field
                    id="task-date"
                    type="date"
                    name="dueDate"
                    className={`form-control ${
                      props.touched.dueDate && props.errors.dueDate
                        ? "is-invalid"
                        : ""
                    }`}
                    min={dateToYYYYMMDD(new Date())}
                    max="2099-12-12"
                  />
                  <div className="invalid-feedback">
                    {props.touched.dueDate && props.errors.dueDate}
                  </div>

                  <label htmlFor="task-time" className="fw-bold ms-1 mt-2">
                    Time
                  </label>
                  <Field
                    type="time"
                    name="time"
                    id="task-time"
                    className={`form-control mt-1 ${
                      props.touched.time && props.errors.time
                        ? "is-invalid"
                        : ""
                    }`}
                    disabled={!props.values.dueDate}
                  />
                  <div className="invalid-feedback">
                    {props.touched.time && props.errors.time}
                  </div>

                  <div className="row mt-4 justify-content-center">
                    <div className="col-md-4 order-2 order-md-1 mt-2 mt-md-0">
                      <button
                        className="btn btn-danger form-control rounded"
                        onClick={() => setShowAddTask(false)}
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
                </Form>
              </fieldset>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCategory;

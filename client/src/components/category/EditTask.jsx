import React from "react";

import { Modal, Spinner } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { taskValidation } from "../../schemas/taskValidation";
import { dateToYYYYMMDD } from "../../config/dateConverter";
import { errorToast, successToast } from "../../config/toastNotification";
import ButtonTheme from "../buttons/ButtonTheme";
import useResetAllState from "../../hooks/useResetAllState";
import useSetActivities from "../../hooks/useSetActivities";
import useSetTasks from "../../hooks/useSetTasks";

const EditTask = ({
  showEditTask,
  setShowEditTask,
  isDismissableEdit,
  setIsDismissableEdit,
  taskId,
  setTaskId
}) => {
  const taskState = useSelector((state) => state.categories);
  const { id } = useParams("id");
  const navigate = useNavigate();
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();
  const selectedTask = taskState.categories
    ?.filter((category) => category._id === id)[0]
    .tasks.filter((task) => task._id === taskId)[0];

  //submit handler for adding a new task
  const onSubmit = async (values, action) => {
    setIsDismissableEdit(false);
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

      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          `/api/categories/${id}/edit-task/${taskId}`,
        formData
      );

      if (response.status === 200) {
        //set new tasks and recent activities to the redux store
        setActivities(response.data.activities);
        setTasks(response.data.categories, response.data.totalCount);
        setShowEditTask(false);
        setTaskId("");
        successToast("Task successfully updated");
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
      setIsDismissableEdit(true);
    }
  };

  return (
    <>
      {/* Modal for editing task */}
      <Modal
        show={showEditTask}
        onHide={() => {
          setShowEditTask(false);
          setTaskId("");
        }}
        backdrop={isDismissableEdit ? true : "static"}
      >
        <Modal.Body>
          <Formik
            initialValues={{
              name: selectedTask?.name,
              description: selectedTask?.description,
              priority: selectedTask?.priority,
              dueDate: selectedTask?.dueDate
                ? dateToYYYYMMDD(new Date(selectedTask?.dueDate))
                : "",
              time: selectedTask?.dueDate
                ? new Date(selectedTask?.dueDate).toLocaleTimeString([], {
                    hour12: false
                  })
                : ""
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

                  <Field
                    type="time"
                    name="time"
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
                        onClick={() => {
                          setShowEditTask(false);
                          setTaskId("");
                        }}
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
                          "Update"
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

export default EditTask;

import React, { useState } from "react";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { AiFillCheckCircle, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { errorToast, successToast } from "../../config/toastNotification";
import useResetAllState from "../../hooks/useResetAllState";
import useSetActivities from "../../hooks/useSetActivities";
import useSetTasks from "../../hooks/useSetTasks";
import {
  parentVariant,
  taskCardVariant
} from "../../config/framerMotionVariants";
import { dateToStringDateTime } from "../../config/dateConverter";
import EditTask from "../../components/category/EditTask";

const TasksList = ({ selectedCategory, id }) => {
  const [taskFilter, setTaskFilter] = useState("ongoing");
  const [showEditTask, setShowEditTask] = useState(false);
  const [isDismissableEdit, setIsDismissableEdit] = useState(true);
  const [taskId, setTaskId] = useState("");
  const navigate = useNavigate();
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();

  //update task status
  const updateStatus = async (e) => {
    const fieldset = e.currentTarget.parentElement;

    try {
      fieldset.disabled = true;
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          `/api/categories/${id}/update-status`,
        { taskid: e.currentTarget.dataset.taskid }
      );

      if (response.status === 200) {
        setTasks(response.data.categories, response.data.totalCount);
        setActivities(response.data.activities);
        successToast("Task completed");
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
    } finally {
      fieldset.disabled = false;
    }
  };

  //delete a task
  const deleteTask = async (e) => {
    const fieldset = e.currentTarget.parentElement;

    try {
      fieldset.disabled = true;
      const response = await axios.delete(
        process.env.REACT_APP_API_SERVER +
          `/api/categories/${id}/delete-task/${e.currentTarget.dataset.taskid}`
      );

      if (response.status === 200) {
        setTasks(response.data.categories, response.data.totalCount);
        setActivities(response.data.activities);
        successToast("Task deleted");
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
    } finally {
      fieldset.disabled = false;
    }
  };

  return (
    <>
      <p className="mb-1 fw-bold fs-5">Task filter</p>
      <select
        className="form-select mb-4"
        onChange={(e) => setTaskFilter(e.target.value)}
        value={taskFilter}
      >
        <option value="ongoing">On going tasks</option>
        <option value="completed">Completed tasks</option>
      </select>

      {selectedCategory?.tasks.length === 0 && (
        <p className="text-start text-md-center text-accent fw-bold mt-4 fs-5 rounded">
          No tasks found in this category. You can add one by clicking the "Add"
          button
        </p>
      )}

      {/* display tasks */}
      {selectedCategory?.tasks.length !== 0 && (
        <LayoutGroup>
          <motion.div layout className="row" variants={parentVariant}>
            <AnimatePresence>
              {selectedCategory.tasks.filter(
                (task) => task.status === taskFilter
              ).length !== 0 ? (
                selectedCategory.tasks
                  .filter((task) => task.status === taskFilter)
                  .map((task) => (
                    <motion.div
                      layout
                      variants={taskCardVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="col-md-6 my-2"
                      key={task._id}
                    >
                      <div className="task-card rounded border border-1 shadow-sm p-3 d-flex flex-column">
                        {task.dueDate &&
                          new Date() > new Date(task.dueDate) && (
                            <span className="badge bg-danger d-inline-block align-self-start">
                              OVERDUE ( LATE )
                            </span>
                          )}
                        <p className="text-accent fw-bold mb-1 fs-5">
                          {task.name}{" "}
                        </p>

                        <small className="d-block fst-italic mb-1">
                          {task.description
                            ? task.description
                            : "No Description"}
                        </small>

                        {task.priority === 1 && (
                          <span className="badge bg-success mb-1 d-inline-block align-self-start mb-4">
                            Low Priority
                          </span>
                        )}
                        {task.priority === 2 && (
                          <span className="badge bg-warning text-dark mb-1 d-inline-block align-self-start mb-4">
                            Medium Priority
                          </span>
                        )}
                        {task.priority === 3 && (
                          <span className="badge bg-danger mb-1 d-inline-block align-self-start mb-4">
                            High Priority
                          </span>
                        )}

                        <p className="text-accent">
                          <span className="fw-bold">Due date: </span>
                          {task.dueDate
                            ? dateToStringDateTime(new Date(task.dueDate))
                            : "No due date"}
                        </p>

                        <div className="d-flex justify-content-end mt-4 mt-auto">
                          <fieldset>
                            <button
                              className={`btn btn-sm btn-info mx-1 rounded ${
                                taskFilter === "completed" && "d-none"
                              }`}
                              aria-label="edit"
                              data-taskid={task._id}
                              onClick={(e) => {
                                setTaskId(e.currentTarget.dataset.taskid);
                                setShowEditTask(true);
                              }}
                            >
                              <span className="d-none d-lg-block">Edit</span>
                              <span className="d-block d-lg-none">
                                <AiFillEdit size={20} />
                              </span>
                            </button>

                            <button
                              className="btn btn-sm btn-danger mx-1 rounded"
                              aria-label="delete"
                              data-taskid={task._id}
                              onClick={deleteTask}
                            >
                              <span className="d-none d-lg-block">Delete</span>
                              <span className="d-block d-lg-none">
                                <AiFillDelete size={20} />
                              </span>
                            </button>

                            <button
                              className={`btn btn-sm btn-success mx-1 rounded ${
                                taskFilter === "completed" && "d-none"
                              }`}
                              aria-label="mark as complete"
                              data-taskid={task._id}
                              onClick={updateStatus}
                            >
                              <span className="d-none d-lg-block">
                                Mark as completed
                              </span>
                              <span className="d-block d-lg-none">
                                <AiFillCheckCircle size={20} />
                              </span>
                            </button>
                          </fieldset>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <motion.p
                  layout
                  className="text-accent text-center fw-bold fs-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No tasks to show
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}

      {/* Edit task modal */}
      <EditTask
        showEditTask={showEditTask}
        setShowEditTask={setShowEditTask}
        isDismissableEdit={isDismissableEdit}
        setIsDismissableEdit={setIsDismissableEdit}
        taskId={taskId}
        setTaskId={setTaskId}
      />
    </>
  );
};

export default TasksList;

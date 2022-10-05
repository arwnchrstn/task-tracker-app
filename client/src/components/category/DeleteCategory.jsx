import React, { useState } from "react";

import { Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import { errorToast, successToast } from "../../config/toastNotification";
import useResetAllState from "../../hooks/useResetAllState";
import useSetActivities from "../../hooks/useSetActivities";
import useSetTasks from "../../hooks/useSetTasks";
import ButtonTheme from "../buttons/ButtonTheme";

const DeleteCategory = ({ showDeleteTask, setShowDeleteTask }) => {
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const { id } = useParams("id");
  const navigate = useNavigate();
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();

  //handle delete category
  const deleteCategory = async () => {
    setIsDeleteSubmitting(true);
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_SERVER +
          `${process.env.REACT_APP_CATEGORY_ENDPOINT}/${id}/delete`
      );

      if (response.status === 200) {
        setActivities(response.data.activities);
        setTasks(response.data.categories, response.data.totalCount);

        setShowDeleteTask(false);
        navigate("/dashboard");
        successToast("Category successfully deleted");
      }
    } catch (error) {
      if (error.response.status === 500) {
        errorToast(error.response.data);
      } else if (error.response.status === 404) {
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
      setIsDeleteSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal for deleting a task */}
      <Modal
        show={showDeleteTask}
        onHide={() => setShowDeleteTask(false)}
        backdrop={!isDeleteSubmitting ? true : "static"}
      >
        <Modal.Body className="text-center">
          <AiFillWarning size={70} className="text-danger" />
          <h5 className="text-accent text-center mt-3 fw-bold">
            Are you sure you want to delete this category?{" "}
            <span className="text-danger">
              All tasks associated with this category will also be deleted.
            </span>{" "}
            This action is irreversible and cannot be undone.
          </h5>

          <div className="row mt-4 justify-content-center">
            <div className="col-md-4 order-2 order-md-1 mt-2 mt-md-0">
              <button
                className="btn btn-danger form-control rounded"
                onClick={() => setShowDeleteTask(false)}
                type="button"
                disabled={isDeleteSubmitting}
              >
                Cancel
              </button>
            </div>

            <div className="col-md-4 order-1 order-md-2">
              <ButtonTheme
                property="text-white form-control"
                type="submit"
                onClick={deleteCategory}
                disabled={isDeleteSubmitting}
              >
                {isDeleteSubmitting ? (
                  <>
                    Please wait...
                    <Spinner animation="border" variant="light" size="sm" />
                  </>
                ) : (
                  "Delete"
                )}
              </ButtonTheme>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteCategory;

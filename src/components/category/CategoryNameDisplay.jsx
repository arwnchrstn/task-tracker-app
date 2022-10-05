import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import { Formik, Form, Field } from "formik";
import { Spinner } from "react-bootstrap";
import axios from "axios";

import useResetAllState from "../../hooks/useResetAllState";
import useSetActivities from "../../hooks/useSetActivities";
import useSetTasks from "../../hooks/useSetTasks";
import AddCategory from "../../components/category/AddCategory";
import DeleteCategory from "../../components/category/DeleteCategory";
import { categoryValidation } from "../../schemas/categoryValidation";
import { errorToast, successToast } from "../../config/toastNotification";

const CategoryNameDisplay = ({ selectedCategory, id }) => {
  const [editCategoryName, setEditCategoryName] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isDismissableAdd, setIsDismissableAdd] = useState(true);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const { totalCount } = useSelector((state) => state.categories);
  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setTasks = useSetTasks();
  const navigate = useNavigate();

  //handle update category name
  const updateCategory = async (values, action) => {
    if (values.name === selectedCategory.name) {
      setEditCategoryName(false);
      return;
    }

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_SERVER +
          `${process.env.REACT_APP_CATEGORY_ENDPOINT}/${id}/edit`,
        { name: values.name }
      );

      if (response.status === 200) {
        setEditCategoryName(false);
        setTasks(response.data.categories, totalCount);
        setActivities(response.data.activities);
        successToast("Category name changed");
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
      <p className="text-accent fw-bold m-0 fs-5">Category:</p>
      <div className="mb-5">
        {!editCategoryName && (
          <>
            <h3 className="text-theme fw-bold m-0">
              {selectedCategory?.name}{" "}
            </h3>

            <button
              className="btn btn-info btn-sm rounded"
              onClick={() => setShowAddTask(true)}
            >
              Add
            </button>
            <button
              className="btn btn-success btn-sm ms-1 rounded"
              onClick={() => setEditCategoryName(true)}
            >
              Edit name
            </button>
            <button
              className="btn btn-danger btn-sm ms-1 rounded"
              onClick={() => setShowDeleteTask(true)}
            >
              Delete
            </button>
          </>
        )}
        {/* show input box if state is editable */}
        {editCategoryName && (
          <>
            <Formik
              initialValues={{ name: selectedCategory.name }}
              onSubmit={updateCategory}
              validationSchema={categoryValidation}
            >
              {(props) => (
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
                      style={{ width: "initial" }}
                    />
                    <h6
                      className={`m-0 ${!props.isSubmitting ? "d-none" : ""}`}
                    >
                      Please wait... <Spinner animation="border" size="sm" />
                    </h6>
                    <div className="invalid-feedback">
                      {props.touched.name && props.errors.name}
                    </div>

                    <button
                      className="btn btn-danger btn-sm mt-1 rounded"
                      onClick={() => setEditCategoryName(false)}
                      type="button"
                    >
                      <AiFillCloseCircle size={20} />
                    </button>
                    <button
                      className="btn btn-success btn-sm ms-1 rounded mt-1"
                      type="submit"
                    >
                      <AiFillCheckCircle size={20} />
                    </button>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>

      {/* Add category modal */}
      <AddCategory
        showAddTask={showAddTask}
        isDismissableAdd={isDismissableAdd}
        setShowAddTask={setShowAddTask}
        setIsDismissableAdd={setIsDismissableAdd}
      />

      {/* Delete category modal */}
      <DeleteCategory
        showDeleteTask={showDeleteTask}
        setShowDeleteTask={setShowDeleteTask}
      />
    </>
  );
};

export default CategoryNameDisplay;

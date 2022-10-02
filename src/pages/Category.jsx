import React from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Helmet, HelmetProvider } from "react-helmet-async";

import CategoryNameDisplay from "../components/category/CategoryNameDisplay";
import TasksList from "../components/category/TasksList";

const Category = () => {
  const taskState = useSelector((state) => state.categories);

  const { id } = useParams("id");
  const selectedCategory = taskState.categories?.filter(
    (category) => category._id === id
  )[0];

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`TakaTask | ${selectedCategory?.name}`}</title>
        </Helmet>
      </HelmetProvider>

      <div className="container-fluid content-container h-100 p-4 pb-5">
        {!selectedCategory?.name && (
          <h2 className="text-theme text-center fw-bold my-4">
            Loading... <Spinner className="ms-1" animation="border" />
          </h2>
        )}

        {selectedCategory?.name && (
          <>
            <CategoryNameDisplay selectedCategory={selectedCategory} id={id} />
            <TasksList selectedCategory={selectedCategory} id={id} />
          </>
        )}
      </div>
    </>
  );
};

export default Category;

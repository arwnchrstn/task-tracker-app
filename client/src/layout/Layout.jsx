import React from "react";

import { Outlet } from "react-router-dom";

import task from "../assets/task.svg";
import useLoadUser from "../hooks/useLoadUser";
import loaderImage from "../assets/loader.webm";

const Layout = () => {
  const loader = (
    <div
      className="position-fixed w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-light"
      style={{ zIndex: 9999 }}
    >
      <video autoplay loop muted playsinline>
        <source src={loaderImage} type="video/webm" />
      </video>
      <h2 className="text-accent fw-bold mt-3">Please wait...</h2>
    </div>
  );
  const loadUser = useLoadUser();

  //wait before user to be loaded from the server before rendering
  if (loadUser) return loader;

  return (
    <div className="main-layout justify-content-center">
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center">
            <img
              className="img-fluid d-none d-md-inline"
              src={task}
              alt="manage task"
              width="65%"
            />
            <h1 className="text-theme fw-bold mt-3">TakaTask</h1>
            <h5 className="text-accent-theme px-3 text-center">
              A simple task tracker app
            </h5>
          </div>
          <div className="col-11 col-md-6 d-flex flex-column justify-content-center rounded px-md-5 mt-md-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

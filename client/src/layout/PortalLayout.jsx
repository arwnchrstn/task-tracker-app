import React, { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import useLoadUser from "../hooks/useLoadUser";
import loaderImage from "../assets/loader.webm";

const PortalLayout = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
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
    <>
      <div className="portal-layout">
        <div className="row h-100">
          <div className="col-md-4 col-lg-3 bg-accent-theme text-secondary-theme shadow py-3 p-md-4 navbar-top">
            <div className="container-fluid">
              <div
                className={`sidebar-backdrop ${
                  isSidebarActive ? "active" : "inactive"
                }`}
                onClick={() => setIsSidebarActive(!isSidebarActive)}
              ></div>

              <div
                className="toggle-sidebar d-flex d-md-none"
                onClick={() => setIsSidebarActive(!isSidebarActive)}
              >
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            <Sidebar
              isSidebarActive={isSidebarActive}
              setIsSidebarActive={setIsSidebarActive}
            />
          </div>
          <div className="col-md-8 col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default PortalLayout;

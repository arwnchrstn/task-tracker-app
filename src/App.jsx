import React, { Suspense, useEffect } from "react";

import { ToastContainer } from "react-toastify";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./layout/Layout";
import PlainLayout from "./layout/PlainLayout";
import PortalLayout from "./layout/PortalLayout";
import { layout, plainLayout, portalRoutes } from "./routes/routes";
import { setSupported, setPrompt } from "./redux/features/supportPwaSlice";
import loaderImage from "./assets/loader.webm";

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

function App() {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //create install prompt
  useEffect(() => {
    const handler = async (e) => {
      e.preventDefault();
      dispatch(setSupported(true));
      dispatch(setPrompt(e));
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, [dispatch]);

  return (
    <>
      <ToastContainer theme="colored" />
      <Suspense fallback={loader}>
        <Routes>
          {/* Layout (Public) */}
          <Route
            path="/"
            exact
            element={
              userState.username === null && userState.email === null ? (
                <Layout />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          >
            {layout.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                index={route.index}
                exact={route.exact}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* Portal Layout (Private) */}
          <Route
            path="/"
            exact
            element={
              userState.username !== null && userState.email !== null ? (
                <PortalLayout />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            {portalRoutes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={<route.component />}
              />
            ))}
          </Route>

          {/* Plain Layout */}
          <Route element={<PlainLayout />}>
            {plainLayout.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

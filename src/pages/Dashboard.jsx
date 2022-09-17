import React, { useState } from "react";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { MdPendingActions, MdCategory } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Calendar from "react-calendar";
import Clock from "react-live-clock";
import "react-calendar/dist/Calendar.css";

import { dateToStringDateTime, dateToYYYYMMDD } from "../config/dateConverter";
import BarChart from "../components/BarChart";
import ButtonTheme from "../components/buttons/ButtonTheme";

const Dashboard = () => {
  const taskState = useSelector((state) => state.categories);
  const recentActivityState = useSelector((state) => state.recentActivity);
  const [date, setDate] = useState(new Date());
  const [activityCount, setActivityCount] = useState(10);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>TakaTask | Dashboard</title>
        </Helmet>
      </HelmetProvider>

      <div className="container-fluid content-container h-100 p-4 pb-5">
        <h3 className="text-theme fw-bold">TakaTask Dashboard</h3>

        {/* 1st row */}
        <div className="row mt-md-0 mt-lg-3 justify-content-center">
          <div className="col-lg-7 mt-3 mt-md-4 mt-lg-1 order-2 order-lg-1">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100 d-none d-md-block">
              <BarChart
                ongoingCount={taskState.totalCount?.ongoing}
                completedCount={taskState.totalCount?.completed}
                overdueCount={taskState.totalCount?.overdue}
              />
            </div>
          </div>

          <div className="col-lg-5 mt-3 mt-md-4 mt-lg-1 order-1 order-lg-2 text-center">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100">
              <span className="fs-5 fw-bold text-accent">Current Time: </span>
              <Clock
                format={"hh:mm:ss A"}
                ticking={true}
                className="text-accent fw-bold fs-5 ms-1"
              />
              <Calendar
                onChange={setDate}
                value={date}
                className="border border-0"
              />
            </div>
          </div>
        </div>

        {/* 2nd row */}
        <div className="row justify-content-center">
          <div className="col-md-6 mt-2 mt-md-4">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100">
              <h5 className="text-accent fw-bold">
                <MdCategory size={25} className="pb-1" /> Total Categories
              </h5>
              <h4 className="text-accent fw-bold mt-3">
                {!taskState.categories ? (
                  <Spinner animation="border" />
                ) : (
                  taskState.totalCount?.categories
                )}
              </h4>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-4">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100">
              <h5 className="text-accent fw-bold">
                <FaTasks size={25} className="pb-1" /> Total Tasks
              </h5>
              <h4 className="text-accent fw-bold mt-3">
                {!taskState.categories ? (
                  <Spinner animation="border" />
                ) : (
                  taskState.totalCount?.tasks
                )}
              </h4>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-4">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100">
              <h5 className="text-theme fw-bold">
                <MdPendingActions size={25} className="pb-1" /> On Going
              </h5>
              <h4 className="text-accent fw-bold mt-3">
                {!taskState.categories ? (
                  <Spinner animation="border" />
                ) : (
                  taskState.totalCount?.ongoing
                )}
              </h4>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-4">
            <div className="dashboard-card shadow  rounded px-3 py-2 h-100">
              <h5 className="text-success fw-bold">
                <AiOutlineFileDone size={25} className="pb-1" /> Completed
              </h5>
              <h4 className="text-accent fw-bold mt-3">
                {!taskState.categories ? (
                  <Spinner animation="border" />
                ) : (
                  taskState.totalCount?.completed
                )}
              </h4>
            </div>
          </div>
        </div>

        {/* 3rd row */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="dashboard-card shadow  rounded px-3 py-3 h-100">
              <h5 className="text-theme fw-bold mb-3">Recent Activities</h5>
              {recentActivityState.activities?.length === 0 && (
                <p className="text-center text-accent">No activities found</p>
              )}

              {recentActivityState.activities
                ?.slice(0, activityCount)
                .map((activity) => (
                  <p key={activity._id}>
                    <span className="text-accent fw-bold me-2 d-none d-md-inline text-decoration-underline">
                      {dateToStringDateTime(new Date(activity.date))}:
                    </span>
                    <span className="text-accent fw-bold me-2 d-inline d-md-none text-decoration-underline">
                      {dateToYYYYMMDD(new Date(activity.date))}:
                    </span>
                    {activity.event}
                  </p>
                ))}

              {recentActivityState.activities?.length > activityCount && (
                <ButtonTheme
                  property="btn-sm d-block mx-auto text-white px-4"
                  onClick={() => setActivityCount((prev) => prev + 10)}
                >
                  See More
                </ButtonTheme>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

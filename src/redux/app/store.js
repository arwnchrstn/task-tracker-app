import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import taskReducer from "../features/taskSlice";
import recentActivitiesReducer from "../features/recentActivitySlice";
import supportPwaReducer from "../features/supportPwaSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    categories: taskReducer,
    recentActivity: recentActivitiesReducer,
    pwa: supportPwaReducer
  },
  devTools: process.env.NODE_ENV === "production" ? false : true
});

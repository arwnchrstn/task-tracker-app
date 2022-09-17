import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: null
};

const recentActivitySlice = createSlice({
  name: "recentActivity",
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload.activities;
    },
    removeActivities: (state, action) => {
      state.activities = null;
    }
  }
});

export const { setActivities, removeActivities } = recentActivitySlice.actions;
export default recentActivitySlice.reducer;

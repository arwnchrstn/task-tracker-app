import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  email: null,
  isVerified: null,
  dateCreated: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.activities = action.payload.activities;
      state.isVerified = action.payload.isVerified;
      state.dateCreated = action.payload.dateCreated;
    },
    removeUser: (state, action) => {
      state.username = null;
      state.email = null;
      state.activities = null;
      state.isVerified = null;
      state.dateCreated = null;
    }
  }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

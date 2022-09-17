import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
  totalCount: null
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.categories = action.payload.categories;
      state.totalCount = action.payload.totalCount;
    },
    removeTasks: (state, payload) => {
      state.categories = null;
      state.totalCount = null;
    }
  }
});

export const { setTasks, removeTasks } = taskSlice.actions;
export default taskSlice.reducer;

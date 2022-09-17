import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSupported: false,
  promptInstall: null
};

const supportPwaSlice = createSlice({
  name: "supportPwa",
  initialState,
  reducers: {
    setSupported: (state, action) => {
      state.isSupported = action.payload;
    },
    setPrompt: (state, action) => {
      state.promptInstall = action.payload;
    }
  }
});

export const { setSupported, setPrompt } = supportPwaSlice.actions;
export default supportPwaSlice.reducer;

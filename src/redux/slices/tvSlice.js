// tvSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tvSlice = createSlice({
  name: "tv",
  initialState: {
    isActive: false,
  },
  reducers: {
    toggleTv: (state) => {
      state.isActive = !state.isActive;
    },
    setTvState: (state, action) => {
      state.isActive = action.payload;
    },
  },
});

export const { toggleTv, setTvState } = tvSlice.actions;
export default tvSlice.reducer;
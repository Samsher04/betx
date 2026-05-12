// src/store/timezoneSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { applyGlobalTimezone } from "../../utils/helper/timezoneOverride";

const initialState = {
  value: "Asia/Kolkata",
};

const timezoneSlice = createSlice({
  name: "timezone",
  initialState,
  reducers: {
    setTimezone: (state, action) => {
      state.value = action.payload || "Asia/Kolkata";
      applyGlobalTimezone(state.value); 
    },
  },
});

export const { setTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;

// src/redux/slices/routeSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  previousRoute: null,
};

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setPreviousRoute: (state, action) => {
      state.previousRoute = action.payload;
    },
  },
});

export const { setPreviousRoute } = routeSlice.actions;
export default routeSlice.reducer;

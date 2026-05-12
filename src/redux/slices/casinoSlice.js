import { createSlice } from "@reduxjs/toolkit";
import casinoInitialState from "../initialStates/casinoInitialState";

const casinoSlice = createSlice({
  name: "casino",
  initialState: casinoInitialState,
  reducers: {
    updateCasinoSlice(state, action) {
      return { ...state, ...action.payload };
    },
    revertCasino() {
      return { ...casinoInitialState };
    },
  },
});

export const { updateCasinoSlice, revertCasino } = casinoSlice.actions;

export default casinoSlice.reducer;

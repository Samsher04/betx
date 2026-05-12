import { createSlice } from "@reduxjs/toolkit";

const siteCasinoInitialState = [];

const siteCasinoSlice = createSlice({
  name: "siteCasino",
  initialState: siteCasinoInitialState,
  reducers: {
    updateSiteCasinoSlice(state, action) {
      return { ...state, ...action.payload };
    },
    revertSiteCasino() {
      return { ...siteCasinoInitialState };
    },
  },
});

export const { updateSiteCasinoSlice, revertSiteCasino } = siteCasinoSlice.actions;

export default siteCasinoSlice.reducer;

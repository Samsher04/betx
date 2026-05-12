import { createSlice } from "@reduxjs/toolkit";
import intCasinoInitialState from "../initialStates/intCasinoInitialState";

const intCasinoSlice = createSlice({
  name: "intCasino",
  initialState: intCasinoInitialState,
  reducers: {
    updateIntCasinoSlice(state, action) {
      console.log({state, action});
      
      return { ...state, ...action.payload };
    },
    revertIntCasino() {
      return { ...intCasinoInitialState };
    },
  },
});

export const { updateIntCasinoSlice, revertIntCasino } = intCasinoSlice.actions;

export default intCasinoSlice.reducer;

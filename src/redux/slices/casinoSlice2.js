// In AsianExchangeSrc/redux/slices/casinoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const casinoSlice = createSlice({
  name: "casino",
  initialState: {
    casinoList: [],
    casinoApiData: [], 
  },
  reducers: {
    updateCasinoSlice(state, action) {
      state.casinoList = action.payload.casinoList || [];
      state.casinoApiData = action.payload.casinoApiData || state.casinoApiData;
    },
  },
});

export const { updateCasinoSlice } = casinoSlice.actions;
export default casinoSlice.reducer;
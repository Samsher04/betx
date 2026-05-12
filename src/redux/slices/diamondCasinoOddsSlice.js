import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  odds: {},
  loading: false,
  error: null,
};

const diamondCasinoOddsSlice = createSlice({
  name: "diamondCasinoOdds",
  initialState,
  reducers: {
    setDiamondCasinoOddsLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setDiamondCasinoOddsData(state, action) {
      state.odds = action.payload.data;
      state.loading = false;
      state.error = null;
    },
    setDiamondCasinoOddsError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setDiamondCasinoOddsLoading,
  setDiamondCasinoOddsData,
  setDiamondCasinoOddsError,
} = diamondCasinoOddsSlice.actions;

export default diamondCasinoOddsSlice.reducer;
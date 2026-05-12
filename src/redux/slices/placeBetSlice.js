import { createSlice } from "@reduxjs/toolkit";
import { placeBetInitialState } from "../initialStates/placeBetInitialState";

const placeBetSlice = createSlice({
  name: "placeBet",
  initialState: placeBetInitialState,
  reducers: {
    handleOpenPlaceBet(state, action) {
        const { sportId, competitionId, eventId, market, markettype, marketId, selectionId, betBoxBgColor, betType} = action.payload;
        state.placeBetId = `${sportId}:${competitionId}:${eventId}:${marketId}:${market}:${markettype}:${selectionId}`;
        state.betBoxBgColor = betBoxBgColor;
        state.betType = betType;

    },
    handleCancelPlaceBet(state) {
      state.placeBetId = null;
      state.betBoxBgColor = "#ffffff";
  },
  },
});

export const {
  handleOpenPlaceBet,
  handleCancelPlaceBet
} = placeBetSlice.actions;
export default placeBetSlice.reducer;

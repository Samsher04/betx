// src/redux/slices/betSettingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state of the site slice with a single object for site details
const initialState = {
  betSettings: {
    minBet: 50,
    maxBet: 50000,
    sports: [
      { sportName: "Cricket", markets: [{ marketNamex: "Match Odds", minBet: null, maxBet: null}] },
      { sportName: "Soccer", markets: [{ marketName: "Match Odds", minBet: null, maxBet: null }] },
      { sportName: "Tennis", markets: [{ marketName: "Match Odds", minBet: null, maxBet: null }] },
      { sportName: "Horse", markets: [{ marketName: "Match Odds", minBet: null, maxBet: null }] },
      { sportName: "Greyhound", markets: [{ marketName: "Match Odds", minBet: null, maxBet: null }] },
    ],
  },
};


// Create the site slice
const betSettingsSlice = createSlice({
  name: 'betSettings',
  initialState,
  reducers: {
    setbetSettings: (state, action) => {
      state.betSettings = action.payload;  // Update the entire betSettings object
    },
    resetBetSettings: (state,action) => state.betSettings = {}

  },
});

// Export the actions to update the site state
export const { setbetSettings,resetBetSettings} = betSettingsSlice.actions;

// Export the reducer to be included in the store
export default betSettingsSlice.reducer;

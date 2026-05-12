import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique IDs

import { accountinitialState } from "../initialStates/accountinitialState";

const accountSlice = createSlice({
  name: "account",
  initialState: accountinitialState,
  reducers: {
    setAccountType(state, action) {
      state.accountType = action.payload.type;

      // Set default profile data based on account type
      if (action.payload.type === "demo") {
        state.profileData = {
          userName: "RDR:democlient",
          username: "democlient",
          personName: "Demo Client",
          balance: 2000,
          exposure: 50,
          pnl: 500,
          currency: "INR",
        };
      } else if (action.payload.type === "real") {
        state.profileData = action.payload.userData;
      }
    },

    updateProfileData(state, action) {
      state.profileData = { ...state.profileData, ...action.payload };
    },
    setProfileDataFirstLogin(state, action) {
      state.profileData.isFirstLogin = action.payload;
    },
    updateBalance(state, action) {
      state.profileData.balance = action.payload;
    },
    addBet(state, action) {
      state.bets = action.payload;
    },
    addLatestBet(state, action) {
      console.log("state.bets",state.bets);
      
      state.bets = [...state.bets, action.payload];
            console.log("state.bets",state.bets);

    },
    clearBets(state) {
      state.bets = [];
    },

 revertAccount: () => ({...accountinitialState}),

  },
});

export const {
  setLoggedIn,
  setProfileDataFirstLogin,
  setAccountType,
  updateProfileData,
  updateBalance,
  addBet,
  clearBets,
  revertAccount,
  addLatestBet,
} = accountSlice.actions;
export default accountSlice.reducer;

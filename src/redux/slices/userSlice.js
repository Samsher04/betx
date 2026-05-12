import { createSlice } from "@reduxjs/toolkit";
import { userinitialState } from "../initialStates/userinitialstate";

const userSlice = createSlice({
  name: "user",
  initialState: userinitialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.loggedInType = action.payload.loggedInType;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    loginFailure(state, action) {
      state.isLoggedIn = false;
      state.userData = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },

    setUserData(state, action) {
      state.userData = action.payload;
    },

    setUserFirstLogin(state, action) {
      if (state.userData) {
        state.userData.isFirstLogin = action.payload;
      }
    },

    updateSkyFirstLoginStatus(state, action) {
      if (state.userData?.skyFirstLoginStatus) {
        state.userData.skyFirstLoginStatus = {
          ...state.userData.skyFirstLoginStatus,
          ...action.payload,
        };
      }
    },

    updateAvailableBalance(state, action) {
      if (state.userData) {
        state.userData.availableBalance = action.payload;
      }
    },

    updateUserCasinoBalance(state, action) {
      if (state.userData) {
        state.userData.casinoBalance = action.payload;
      }
    },

    updateExposureBalance(state, action) {
      if (state.userData) {
        state.userData.exposure = action.payload;
      }
    },

    setUserLoackApplications(state, action) {
      state.UserLoackApplications = action.payload;
    },

    logout() {
      return userinitialState; // ✅ ONLY RETURN
    },

    // ✅ 🔥 MOST IMPORTANT FIX
    revertUser() {
      return userinitialState; // ❌ NO spread
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setUserData,
  setUserFirstLogin,
  updateSkyFirstLoginStatus,
  updateAvailableBalance,
  updateUserCasinoBalance,
  updateExposureBalance,
  setUserLoackApplications,
  logout,
  revertUser,
} = userSlice.actions;

export default userSlice.reducer;

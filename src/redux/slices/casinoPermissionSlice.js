import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissionList: [], 
};

const casinoPermissionSlice = createSlice({
  name: "casinoPermission",
  initialState,
  reducers: {
    setCasinoPermission: (state, action) => {
      state.permissionList = action.payload.permissionList;
    },
    clearCasinoPermission: (state) => {
      state.permissionList = [];
    },
  },
});

export const { setCasinoPermission, clearCasinoPermission } =
  casinoPermissionSlice.actions;

export default casinoPermissionSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLeftOpen: false,
  isRightOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleLeftSidebar: (state) => {
      state.isLeftOpen = !state.isLeftOpen;
      if (state.isLeftOpen) state.isRightOpen = false; // Close Right Sidebar if Left Opens
    },
    toggleRightSidebar: (state) => {
      state.isRightOpen = !state.isRightOpen;
      if (state.isRightOpen) state.isLeftOpen = false; // Close Left Sidebar if Right Opens
    },
    closeAllSidebars: (state) => {
      state.isLeftOpen = false;
      state.isRightOpen = false;
    },
  },
});

export const { toggleLeftSidebar, toggleRightSidebar, closeAllSidebars } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;

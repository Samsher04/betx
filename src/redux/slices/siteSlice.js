// src/redux/slices/siteSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state of the site slice with a single object for site details
const initialState = {
  siteDetails: null,
  meta_data: null
};

// Create the site slice
const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteDetails: (state, action) => {
      state.siteDetails = action.payload;  // Update the entire siteDetails object
    },
    setMetaDataSettings: (state, action) => {
      state.meta_data = action.payload;  // Update the entire siteDetails object
    }
  },
});

// Export the actions to update the site state
export const { setSiteDetails, setMetaDataSettings} = siteSlice.actions;

// Export the reducer to be included in the store
export default siteSlice.reducer;

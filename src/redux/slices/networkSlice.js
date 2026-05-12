import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch network info (IP, ISP, country, state, city, etc.)
export const fetchNetworkDetails = createAsyncThunk(
  "network/fetchDetails",
  async () => {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    return {
      ip: data.ip,
      isp: data.org, // ISP / Organization
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
      timezone: data.timezone,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      online: navigator.onLine,
      type: navigator.connection?.effectiveType || "unknown",
      downlink: navigator.connection?.downlink || null,
      timestamp: new Date().toISOString(),
    };
  }
);

const networkSlice = createSlice({
  name: "network",
  initialState: {
    ip: null,
    isp: null,
    city: null,
    region: null,
    country: null,
    countryCode: null,
    timezone: null,
    postal: null,
    latitude: null,
    longitude: null,
    online: true,
    type: "unknown",
    downlink: null,
    timestamp: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNetworkDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNetworkDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        Object.assign(state, action.payload);
      })
      .addCase(fetchNetworkDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default networkSlice.reducer;

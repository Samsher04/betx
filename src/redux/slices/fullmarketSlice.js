import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk to fetch market odds via API
export const fetchMarketOdds = createAsyncThunk(
  "marketOdds/fetchMarketOdds",
  async ({ eventType, competitionId, eventId, marketId }, thunkAPI) => {
    try {
      const response = await fetch(
        `https://api.professor.monster/api/v1/fetch-market-odds/${eventType}/${competitionId}/${eventId}/${marketId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Define the initial state as a constant
const initialState = {
  data: {},
  loading: false,
  error: null,
  runningData: null,
  betData: null,
  odsValue: null,
  selectedData: [],
};

const marketOddsSlice = createSlice({
  name: "marketOdds",
  initialState,
  reducers: {
    setMarketOddsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMarketOddsData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setMarketOddsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRunningData: (state, action) => {
      state.runningData = action.payload;
    },
    setMarketName: (state, action) => {
      state.marketName = action.payload;
    },
    setBetData: (state, action) => {
      state.betData = action.payload;
    },
    setOdsValue: (state, action) => {
      state.odsValue = action.payload;
    },
    addSelectedData: (state, action) => {
      const isDuplicate = state.selectedData.some(
        (item) =>
          item.teamName === action.payload.teamName &&
          item.odds === action.payload.odds &&
          item.oddsType === action.payload.oddsType
      );
      if (!isDuplicate) {
        state.selectedData.push(action.payload);
      }
    },
    clearSelectedData: (state) => {
      state.selectedData = [];
    },
    clearBetData: (state) => {
      state.betData = null;
    },
    removeSelectedData: (state, action) => {
      state.selectedData.splice(action.payload, 1);
    },
    // RESET REDUCER
    resetMarketOddsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketOdds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketOdds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || {};
      })
      .addCase(fetchMarketOdds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setMarketOddsLoading,
  setMarketOddsData,
  setMarketOddsError,
  setRunningData,
  setMarketName,
  setBetData,
  clearBetData,
  setOdsValue,
  addSelectedData,
  clearSelectedData,
  removeSelectedData,
  resetMarketOddsState, // export the new action
} = marketOddsSlice.actions;

export default marketOddsSlice.reducer;

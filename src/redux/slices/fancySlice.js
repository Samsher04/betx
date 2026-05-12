import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchfancyOdds = createAsyncThunk(
  "fancyOdds/fetchfancyOdds",
  async ({ eventType, competitionId, eventId }, thunkAPI) => {
    try {
      const response = await fetch(
        `https://api.professor.monster/api/v1/fetch-market-session/${eventType}/${competitionId}/${eventId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const fancyOddsSlice = createSlice({
  name: "fancyOdds",
  initialState: {
    fancyData: {},
    loading: false,
    error: null,
    runningData: {},
    betData: null,
    odsValue: null,
    selectedData: [],
  },
  reducers: {
    setFancyOddsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setFancyOddsData: (state, action) => {
      

      const { matchId, data } = action.payload;
      if (Object.values(state.fancyData).length > 1) { 
        state.fancyData = {};
      }
      state.fancyData[matchId] = {data:data};
      state.loading = false;
    },
    setFancyOddsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRunningData: (state, action) => {
      state.runningData = action.payload;
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
    removeSelectedData: (state, action) => {
      state.selectedData = state.selectedData?.filter(
        (_, index) => index !== action.payload
      );
    },
    clearSelectedData: (state) => {
      state.selectedData = [];
    },
    clearBetData: (state) => {
      state.betData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchfancyOdds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchfancyOdds.fulfilled, (state, action) => {
        state.loading = false;
        state.fancyData = action.payload || {};
      })
      .addCase(fetchfancyOdds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setRunningData,
  setBetData,
  clearBetData,
  setOdsValue,
  addSelectedData,
  removeSelectedData,
  clearSelectedData,
  setFancyOddsLoading,
  setFancyOddsData,
  setFancyOddsError,
} = fancyOddsSlice.actions;

export default fancyOddsSlice.reducer;

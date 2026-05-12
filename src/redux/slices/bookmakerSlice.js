import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchbookmakerOdds = createAsyncThunk(
  "bookmakerOdds/fetchbookmakerOdds",
  async ({ eventType, competitionId, eventId }, thunkAPI) => {
    try {
      const response = await fetch(
        `https://api.professor.monster/api/v1/fetch-bookmaker-odds/${eventType}/${competitionId}/${eventId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return { eventId, data }; // ✅ wrap eventId with the response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const bookmakerOddsSlice = createSlice({
  name: "bookmakerOdds",
  initialState: {
    bookMakerData: {}, // keep as plain object
    error: null,
    runningData: null,
    betData: null,
    odsValue: null,
    selectedData: [],
    loading: false,
  },
  reducers: {
    setBookmakerLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ Always keep only one key/value pair
    setBookmakerData: (state, action) => {
      const { matchId, data } = action.payload;
      if (Object.values(state.bookMakerData).length > 1) {
        state.bookMakerData = {};
      }
      state.bookMakerData[matchId] = { data: data };
      state.loading = false;
    },

    setBookmakerError: (state, action) => {
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
      state.selectedData = state.selectedData.filter(
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
      .addCase(fetchbookmakerOdds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchbookmakerOdds.fulfilled, (state, action) => {
        state.loading = false;
        const { eventId, data } = action.payload;

        // ✅ clear old entry
        state.bookMakerData = {};

        // ✅ add new one
        if (data?.length) {
          state.bookMakerData[eventId] = data[0];
        }
      })
      .addCase(fetchbookmakerOdds.rejected, (state, action) => {
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
  setBookmakerLoading,
  setBookmakerData,
  setBookmakerError,
} = bookmakerOddsSlice.actions;

export default bookmakerOddsSlice.reducer;

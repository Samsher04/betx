import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch matches
export const fetchMatchesByEventId = createAsyncThunk(
  "matches/fetchMatchesByEventId",
  async ({ eventId, sport }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.professor.monster/api/v1/get-matches-by-eventid/${eventId}`
      );
      return { data: response?.data, sport };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    cricket: { matches: [], status: "idle", error: null },
    soccer: { matches: [], status: "idle", error: null },
    tennis: { matches: [], status: "idle", error: null },
  },
  reducers: {
    setMatchesLoading: (state, action) => {
      const { sport } = action.payload;
      state[sport].status = "loading";
    },
    updateMatches: (state, action) => {
      const { sport, data } = action.payload;
      state[sport].matches = data;
      state[sport].status = "succeeded";
    },
    updateMarketOdds: (state, action) => {
      const { sport, data } = action.payload;
      state[sport].marketOdds = data;
      state[sport].status = "succeeded";
    },
    setMatchesError: (state, action) => {
      const { sport, error } = action.payload;
      state.matches[sport].status = "failed";
      state.matches[sport].error = error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchesByEventId.pending, (state, action) => {
        const { sport } = action.meta.arg;
        state[sport].status = "loading";
      })
      .addCase(fetchMatchesByEventId.fulfilled, (state, action) => {
        const { sport, data } = action.payload;
        state[sport].status = "succeeded";
        state[sport].matches = data;
      })
      .addCase(fetchMatchesByEventId.rejected, (state, action) => {
        const { sport } = action.meta.arg;
        state[sport].status = "failed";
        state[sport].error = action.payload;
      });
  },
});
export const { setMatchesLoading, updateMatches, updateMarketOdds, setMatchesError } = matchesSlice.actions;
export default matchesSlice.reducer;

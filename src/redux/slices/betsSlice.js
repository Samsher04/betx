import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { myBet } from "../../api";
import { addBet } from "./accountSlice";

export const fetchBets = createAsyncThunk(
  "bets/fetchBets",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await myBet();

      if (response?.success) {
        const reversedBets = response?.data?.data?.slice().reverse() || [];
        dispatch(addBet(reversedBets));
        return reversedBets;
      } else {
        console.error("Invalid response structure");
        return rejectWithValue("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      return rejectWithValue(error.message || "Failed to fetch bets");
    }
  }
);

const betsSlice = createSlice({
  name: "bets",
  initialState: {
    bets: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMatchBetsData(state, action) {
      // Consider if setting to null is intentional
      // You might want to update bets instead
      state.bets = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.loading = false;
        state.bets = action.payload;
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMatchBetsData } = betsSlice.actions;
export default betsSlice.reducer;
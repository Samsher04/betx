import { createSlice } from "@reduxjs/toolkit";
import kabaddiInitialState from "../initialStates/kabaddiInitialState";

const kabaddiSlice = createSlice({
    name: "kabaddi",
    initialState: kabaddiInitialState,
    reducers: {
        updatekabaddiSlice(state, action) {
            return { ...state, ...action.payload };
        },
      
        updateKabaddiMarket(state, action) {

            const { gmid } = action.payload;
            
            // Convert array to Map for O(1) lookup
            const marketMap = new Map(state.kabaddiMarkets.map(market => [market.gmid, market]));

            // Update or insert the new market data
            marketMap.set(gmid, { ...marketMap.get(gmid), ...action.payload });

            // Convert back to array
            state.kabaddiMarkets = Array.from(marketMap.values());
        },
        revertkabaddi() {
            return { ...kabaddiInitialState };
        },
        revertOnlykabaddiMarkets(state) {
            return { ...state, kabaddiMarkets: [] };
        },
    },
});

export const { updatekabaddiSlice, revertkabaddi, revertOnlykabaddiMarkets,updateKabaddiMarket  } = kabaddiSlice.actions;

export default kabaddiSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import greyhoundInitialState from "../initialStates/greyhoundInitialState";

const greyhoundSlice = createSlice({
    name: "greyhound",
    initialState: greyhoundInitialState,
    reducers: {
        updateGreyhoundSlice(state, action) {
            return { ...state, ...action.payload };
        },
        updateGreyhoundMarket(state, action) {

            const { gmid } = action.payload;
            
            // Convert array to Map for O(1) lookup
            const marketMap = new Map(state.greyhoundMarkets.map(market => [market.gmid, market]));

            // Update or insert the new market data
            marketMap.set(gmid, { ...marketMap.get(gmid), ...action.payload });

            // Convert back to array
            state.greyhoundMarkets = Array.from(marketMap.values());
        },
        updateGreyhoundParticularOdds(state, action) {
            const { gmid, odds } = action.payload;

            const existingMarketIndex = state.greyhoundMarkets.findIndex(ghm => ghm.gmid === gmid);
        
            if (existingMarketIndex !== -1) {
                const existingMarket = state.greyhoundMarkets[existingMarketIndex];
        
                // Create a Map to deduplicate odds by unique key (e.g. selectionId)
                const oddsMap = new Map();
        
                // First, add existing odds
                (existingMarket.odds || []).forEach(odd => {
                    oddsMap.set(odd.selectionId, odd);
                });
        
                // Then, override or add new odds
                (odds || []).forEach(odd => {
                    oddsMap.set(odd.selectionId, { ...oddsMap.get(odd.selectionId), ...odd });
                });
        
                state.greyhoundMarkets[existingMarketIndex] = {
                    ...existingMarket,
                    odds: Array.from(oddsMap.values()),
                };
            } else {
                state.greyhoundMarkets.push({ gmid, odds });
            }
        },
        
        
        revertGreyhound() {
            return { ...greyhoundInitialState };
        },
        revertOnlyGreyhoundMarkets(state) {
            return { ...state, greyhoundMarkets: [] };
        },
    },
});

export const { updateGreyhoundSlice, updateGreyhoundMarket, updateGreyhoundParticularOdds, revertGreyhound, revertOnlyGreyhoundMarkets } = greyhoundSlice.actions;

export default greyhoundSlice.reducer;

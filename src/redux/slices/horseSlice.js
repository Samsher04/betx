import { createSlice } from "@reduxjs/toolkit";
import horseInitialState from "../initialStates/horseInitialState";

const horseSlice = createSlice({
    name: "horse",
    initialState: horseInitialState,
    reducers: {
        updateHorseSlice(state, action) {
            return { ...state, ...action.payload };
        },
        updateHorseMarket(state, action) {

            const { gmid } = action.payload;
            
            // Convert array to Map for O(1) lookup
            const marketMap = new Map(state.horseMarkets.map(market => [market.gmid, market]));

            // Update or insert the new market data
            marketMap.set(gmid, { ...marketMap.get(gmid), ...action.payload });

            // Convert back to array
            state.horseMarkets = Array.from(marketMap.values());
        },
        updateHorseParticularOdds(state, action) {
            const { gmid, odds } = action.payload;

            const existingMarketIndex = state.horseMarkets.findIndex(ghm => ghm.gmid === gmid);
        
            if (existingMarketIndex !== -1) {
                const existingMarket = state.horseMarkets[existingMarketIndex];
        
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
        
                state.horseMarkets[existingMarketIndex] = {
                    ...existingMarket,
                    odds: Array.from(oddsMap.values()),
                };
            } else {
                state.horseMarkets.push({ gmid, odds });
            }
        },
        
        
        revertHorse() {
            return { ...horseInitialState };
        },
        revertOnlyHorseMarkets(state) {
            return { ...state, horseMarkets: [] };
        },
    },
});

export const { updateHorseSlice, updateHorseMarket, updateHorseParticularOdds, revertHorse, revertOnlyHorseMarkets } = horseSlice.actions;

export default horseSlice.reducer;

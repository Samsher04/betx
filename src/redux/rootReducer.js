// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import { RESET_APP } from "./appReset";

import accountSlice from "./slices/accountSlice";
import userSlice from "./slices/userSlice";
import siteSlice from "./slices/siteSlice";
import betSettingsSlice from "./slices/betSettingsSlice";
import matchesReducer from "./slices/matchSlice";
import marketOddsReducer from "./slices/fullmarketSlice";
import betsReducer from "./slices/betsSlice";
import bookmakerOddsReducer from "./slices/bookmakerSlice";
import fancyOddsReducer from "./slices/fancySlice";
import sidebarReducer from "./slices/sidebarSlice";



import casinoReducer from "./slices/casinoSlice";
import intCasinoReducer from "./slices/intCasinoSlice";
import greyhoundReducer from "./slices/greyhoundSlice";
import horseReducer from "./slices/horseSlice";
import authModalSlice from "./slices/authModalSlice";
import placeBetReducer from "./slices/placeBetSlice";
import siteCasinoReducer from "./slices/siteCasinoSlice";
import routeReducer from "./slices/routeSlice";
import timezoneReducer from "./slices/timezoneSlice";
import networkReducer from "./slices/networkSlice";
import kabaddiReducer from "./slices/kabaddiSlice";
import diamondCasinoOddsReducer from "./slices/diamondCasinoOddsSlice";
import casinoPermissionReducer from "./slices/casinoPermissionSlice";
import tvReducer from "./slices/tvSlice";

const appReducer = combineReducers({
  authModal: authModalSlice,
  site: siteSlice,
  betSettingsSlice,
  account: accountSlice,
  user: userSlice,
  matches: matchesReducer,
  marketOdds: marketOddsReducer,
  bookmakerOdds: bookmakerOddsReducer,
  fancyOdds: fancyOddsReducer,
  bets: betsReducer,
  sidebar: sidebarReducer,
  casino: casinoReducer,
  siteCasino: siteCasinoReducer,
  intCasino: intCasinoReducer,
  greyhound: greyhoundReducer,
  horse: horseReducer,


  placeBet: placeBetReducer,
  route: routeReducer,
  timezone: timezoneReducer,
  network: networkReducer,
  kabaddi: kabaddiReducer,
  diamondCasinoOdds: diamondCasinoOddsReducer,
  casinoPermission: casinoPermissionReducer,
      tv: tvReducer,
});

const rootReducer = (state, action) => {
  if (action.type === RESET_APP) {
    state = undefined; // 🔥 redux memory clear
  }
  return appReducer(state, action);
};

export default rootReducer;

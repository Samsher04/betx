import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import storage from "redux-persist-indexeddb-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import rootReducer from "./rootReducer";
import { logoutMiddleware } from "../utils/logoutMiddleware";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage: storage("root"),
  whitelist: [
    "account",
    "user",
    "marketOdds",
    "bookmakerOdds",
    "horse",
    "greyhound",
    "site",
    "matches",
    "betSettingsSlice",
    "intCasino",
    "timezone",
    "network",
    "casinoPermission",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
    
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE],
//       },
//       immutableCheck: false,
//     }).concat(sagaMiddleware),

//   devTools: import.meta.env.PROD ? false : true,
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(logoutMiddleware)
      .concat(sagaMiddleware),
      devTools: import.meta.env.PROD ? false : true,
});

export const persistor = persistStore(store);
export default store;

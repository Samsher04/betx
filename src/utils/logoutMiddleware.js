
import { RESET_APP } from "../redux/appReset";
import { persistor } from "../redux/store";


export const logoutMiddleware = () => (next) => async (action) => {
  if (action.type === RESET_APP) {
    // 🔥 IndexedDB / redux-persist CLEAR
    await persistor.pause();
    await persistor.purge();
    await persistor.flush();

    // optional extra safety
    localStorage.clear();
    sessionStorage.clear();
  }

  return next(action);
};

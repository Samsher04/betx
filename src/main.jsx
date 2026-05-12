import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store from "./redux/store";
import { Provider } from "react-redux";
import { AppToastContainer } from "./utils/ToastContent";

const App = React.lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <React.Suspense fallback={null}>
       <AppToastContainer   closeButton={false}/>
        <App />
      </React.Suspense>
    </BrowserRouter>
  </Provider>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import store from "./redux/store";
import { Provider } from "react-redux";

const App = React.lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <React.Suspense fallback={null}>
          <App />
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
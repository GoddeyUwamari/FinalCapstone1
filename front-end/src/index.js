import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./styles/main.css";

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="page-loader">
          <p>Loading...</p>
        </div>
      }
    >
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// No <BrowserRouter> on the maintenance branch — the app is one static page, so
// react-router drops out of the bundle entirely.
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/index.js
// Application entry point — mounts React app and registers PWA service worker

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { register } from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA / offline support
register({
  onUpdate: (registration) => {
    console.log("Guest app updated. Refresh to see the latest version.");
  },
  onSuccess: (registration) => {
    console.log("Guest app cached for offline use.");
  },
});

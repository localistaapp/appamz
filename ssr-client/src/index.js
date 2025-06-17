import React from "react";
import ReactDOMClient from "react-dom/client";
import "./index.css";
import App from "./App";
import Dashboard from "./store/Dashboard";
import AppDashboard from "./app/AppDashboard";

if (document.getElementById("root-store") != null) {
    ReactDOMClient.hydrateRoot(document.getElementById("root-store"), <Dashboard />);
} else if (document.getElementById("root-app") != null) {
    ReactDOMClient.hydrateRoot(document.getElementById("root-app"), <AppDashboard />);
}


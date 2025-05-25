import React from "react";
import ReactDOMClient from "react-dom/client";
import "./index.css";
import App from "./App";
import Dashboard from "./store/Dashboard";

ReactDOMClient.hydrateRoot(document.getElementById("root-store"), <Dashboard />);

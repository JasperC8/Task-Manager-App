import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from "axios";

axios.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
      window.location = "/login";
    }
    return Promise.reject(err);
  }
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { ApiProvider } from "./context/ApiProvider";
import { CourseProvider } from "./context/CourseProvider";
import "./styles/reset.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <AuthProvider>
          <CourseProvider>
            <App />
          </CourseProvider>
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { UserProvider } from "./context/UserProvider";
import { ApiProvider } from "./context/ApiProvider";
import "./styles/reset.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

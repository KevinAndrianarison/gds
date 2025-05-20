import { StrictMode } from "react";
import React from 'react';
import 'nprogress/nprogress.css';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ShowContextProvider } from "./contexte/useShow.jsx";
import { BrowserRouter } from "react-router-dom";
import { UrlContextProvider } from "./contexte/useUrl";
import { UserContextProvider } from "./contexte/useUser";
import { RegionContextProvider } from "./contexte/useRegion";
import { AuthContextProvider } from "./contexte/AuthContext";
import { SupplyContextProvider } from "./contexte/useSupply";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UrlContextProvider>
        <ShowContextProvider>
          <RegionContextProvider>
            <UserContextProvider>
              <SupplyContextProvider>
                <AuthContextProvider>
                  <App />
                </AuthContextProvider>
              </SupplyContextProvider>
            </UserContextProvider>
          </RegionContextProvider>
        </ShowContextProvider>
      </UrlContextProvider>
    </BrowserRouter>
  </StrictMode>
);

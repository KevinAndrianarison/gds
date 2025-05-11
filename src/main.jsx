import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ShowContextProvider } from "./contexte/useShow.jsx";
import { BrowserRouter } from "react-router-dom";
import { UrlContextProvider } from "./contexte/useUrl";
import { UserContextProvider } from "./contexte/useUser";
import { RegionContextProvider } from "./contexte/useRegion";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UrlContextProvider>
        <ShowContextProvider>
          <RegionContextProvider>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </RegionContextProvider>
        </ShowContextProvider>
      </UrlContextProvider>
    </BrowserRouter>
  </StrictMode>
);

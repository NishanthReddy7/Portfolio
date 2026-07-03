import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// self-hosted fonts — display (angular), body (humanist), data (mono)
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/chakra-petch/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./index.css";
import "./styles/chrome.css";
import "./styles/sections.css";
import "./styles/terminal.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

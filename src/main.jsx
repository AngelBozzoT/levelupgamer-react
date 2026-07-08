import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap CSS (primero, para que los estilos custom lo puedan sobreescribir)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Estilos globales propios de Level-Up Gamer
import "./index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

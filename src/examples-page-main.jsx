import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ExamplesPage from "./ExamplesPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExamplesPage />
  </StrictMode>
);

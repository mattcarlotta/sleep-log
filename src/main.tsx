import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import DBProvider from "./DBContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <DBProvider>
            <App />
        </DBProvider>
    </StrictMode>
);

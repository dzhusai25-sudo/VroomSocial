import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from './contexts/ThemeContext';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const theme = createTheme({
  palette: {
    primary: { main: "#090762bd" },
  },
});

root.render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

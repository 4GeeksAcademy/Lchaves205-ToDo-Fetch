// Import React and ReactDOM
import React from "react";
import { createRoot } from "react-dom/client";


import "../styles/index.css";
import Home from "./component/home.jsx";


const root = createRoot(document.getElementById("app"));
root.render(<Home />);

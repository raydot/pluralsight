// CRA supports importing CSS. Who knew?
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { render } from "react-dom";
//import HomePage from "./components/HomePage";
//import AboutPage from "./components/AboutPage";
import App from "./components/App";

render(<App />, document.getElementById("root"));

import React from "react";
import Routes from "./layout/Routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes />
      <ToastContainer position="bottom-center" pauseOnHover />
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Web3Provider } from "./contexts/web3Context";
import { Nav } from "./components";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Vote from "./pages/Vote";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Web3Provider>
        <SnackbarProvider>
          <Nav />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vote" element={<Vote />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SnackbarProvider>
      </Web3Provider>
    </BrowserRouter>
  );
}

import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main className="d-flex justify-content-center align-items-center flex-column">
      <h1 className="text-center">
        Secure e-voting system using blockchain technology
      </h1>
      <div className="my-3">
        <NavLink className="btn btn-lg register-link" to="/register">
          Register
        </NavLink>
        <NavLink className="btn btn-lg ms-2 vote-link" to="/vote">
          Vote
        </NavLink>
      </div>
      <p className="text-center">By Ubochi Chibuze</p>
    </main>
  );
}

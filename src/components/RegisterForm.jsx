import React, { useState } from "react";
import Swal from "sweetalert2";
import Button from "./Button";
import useWeb3 from "../hooks/useWeb3";
import useFaceIO from "../hooks/useFaceIO";
import { findVoter, verifyIdentityNumber } from "../api";

export default function RegisterForm() {
  const { connected, address, requesting, requestType, register } = useWeb3();
  const { handleEnroll } = useFaceIO();
  const [identityNumber, setIdentityNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [constituencyCode, setConstituencyCode] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (identityNumber && fullName && age && stateCode && constituencyCode) {
      const isVerified = await verifyIdentityNumber(identityNumber);

      if (!isVerified) {
        Swal.fire({
          text: `Invalid identity number`,
          icon: "error",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
        return;
      }

      if (+age < 18) {
        Swal.fire({
          text: `You must be 18 years old and above to register`,
          icon: "error",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
        return;
      }

      const { facialId } = await handleEnroll(
        fullName,
        address,
        identityNumber
      );
      if (!facialId) {
        Swal.fire({
          text: `Face capture failed. Try again!`,
          icon: "error",
          padding: "3em",
          color: "#716add",
          backdrop: `rgba(0,0,0,0.8)`,
        });
        return;
      }

      await register({
        identityNumber,
        facialId,
        fullName,
        age,
        stateCode,
        constituencyCode,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="form-box p-3">
      <form onSubmit={handleRegister}>
        <input
          type="number"
          placeholder="Identity Number"
          className="form-control form-control-lg my-2"
          value={identityNumber}
          onChange={(e) => {
            setIdentityNumber(e.target.value);
            const voter = findVoter(e.target.value);
            if (voter) {
              setFullName(voter.fullName);
            } else {
              setFullName("");
            }
          }}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          className="form-control form-control-lg my-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="form-control form-control-lg my-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <select
          className="form-control form-control-lg my-2"
          onChange={(e) => setStateCode(e.target.value)}
          required
        >
          <option value="" disabled selected>
            Select state code
          </option>
          <option value="10">10</option>
          <option value="11">11</option>
        </select>
        <select
          className="form-control form-control-lg my-2"
          onChange={(e) => setConstituencyCode(e.target.value)}
          required
        >
          <option value="" disabled selected>
            Select constituency code
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <Button
          text="Register"
          classes="btn btn-lg w-100"
          disabled={!connected}
          loading={requesting && requestType === "register"}
        />
      </form>
    </div>
  );
}

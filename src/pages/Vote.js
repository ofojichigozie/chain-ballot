import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { CandidateItem, Button } from "../components";
import useWeb3 from "../hooks/useWeb3";
import useFaceIO from "../hooks/useFaceIO";
import { toInt } from "../utils/formatter";
import { verifyIdentityNumber } from "../api";

export default function Vote() {
  const {
    connected,
    requesting,
    requestType,
    identityNumber,
    electionRecords,
    vote,
    reloadElectionRecords,
  } = useWeb3();
  const { handleAuthenticate } = useFaceIO();
  const { candidates, isEligible, hasVoted } = electionRecords;
  const [inFacialAuth, setInFacialAuth] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const handleSelectCandidate = (nominationNumber) => {
    setSelectedCandidate(nominationNumber);
  };

  const lookUpIdentityNumber = async (e) => {
    e.preventDefault();

    if (!idNumber) return;

    const isVerified = await verifyIdentityNumber(idNumber);
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

    await reloadElectionRecords(idNumber);
  };

  const handleVote = async () => {
    if (identityNumber && selectedCandidate) {
      setInFacialAuth(true);
      const { facialId } = await handleAuthenticate();
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

      setTimeout(() => {
        setInFacialAuth(false);
      }, 2000);

      const currentTime = toInt(Date.now() / 1000);
      await vote({
        facialId,
        voterIdentityNumber: identityNumber,
        candidateNominationNumber: selectedCandidate,
        currentTime,
      });
    }
  };

  if (!connected) {
    return (
      <div className="vote p-3 mt-5">
        <h5 className="text-center text-secondary">
          Please connect your wallet to vote
        </h5>
      </div>
    );
  }

  if (connected && !identityNumber) {
    return (
      <div className="vote p-3 mt-5">
        <h5 className="text-center text-secondary">
          Your identity number couldn't be detected
        </h5>
        <form onSubmit={lookUpIdentityNumber} className="idn-detect mt-3">
          <input
            type="number"
            placeholder="Enter identity number"
            className="form-control form-control-lg"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
          />
          <Button
            text="Verify"
            classes="mt-3 btn w-100"
            disabled={requesting}
            loading={requesting && requestType === "verify"}
          />
        </form>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="vote text-center p-3 mt-5">
        <h5 className="text-center text-secondary">
          It seems you've not registered. Please register to be eligible to vote
        </h5>
        <NavLink className="btn register-link" to="/register">
          Register
        </NavLink>
      </div>
    );
  }

  if (hasVoted.hasVoted) {
    return (
      <div className="vote p-3 mt-5">
        <h5 className="text-center text-secondary">
          You've alredy voted for the candidate:
        </h5>
        <CandidateItem
          candidate={hasVoted.candidate}
          isSelectedCandidate
          onSelectCandidate={handleSelectCandidate}
        />
      </div>
    );
  }

  return (
    <>
      {!inFacialAuth && (
        <div className="vote p-3 mt-3">
          <h2 className="mb-4">Vote</h2>
          {candidates &&
            candidates.map((candidate, index) => (
              <CandidateItem
                key={index}
                candidate={candidate}
                isSelectedCandidate={
                  candidate.nominationNumber === selectedCandidate
                }
                onSelectCandidate={handleSelectCandidate}
              />
            ))}
          <div className="d-flex justify-content-end mt-3">
            <Button
              text="vote"
              classes="btn btn-lg border-light px-4 w-25"
              disabled={!connected || !selectedCandidate}
              loading={requesting && requestType === "vote"}
              onClick={handleVote}
            />
          </div>
        </div>
      )}
    </>
  );
}

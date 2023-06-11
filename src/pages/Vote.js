import React, { useState } from "react";
import { CandidateItem, Button } from "../components";
import useWeb3 from "../hooks/useWeb3";
import { toInt } from "../utils/formatter";

export default function Vote() {
  const {
    connected,
    requesting,
    requestType,
    identityNumber,
    electionRecords,
    vote,
  } = useWeb3();
  const { candidates } = electionRecords;
  const [selectedCandidate, setSelectedCandidate] = useState("");

  const handleSelectCandidate = (nominationNumber) => {
    setSelectedCandidate(nominationNumber);
  };

  const handleVote = async () => {
    if (identityNumber && selectedCandidate) {
      const currentTime = toInt(Date.now() / 1000);
      await vote({
        voterIdentityNumber: identityNumber,
        candidateNominationNumber: selectedCandidate,
        currentTime,
      });
    }
  };

  if (!connected) {
    return (
      <div className="vote p-3 mt-5">
        <h5 className="text-center">Please connect your wallet to vote</h5>
      </div>
    );
  }

  return (
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
  );
}

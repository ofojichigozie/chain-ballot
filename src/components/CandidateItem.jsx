import React from "react";
import Identicon from "react-identicons";
import checked from "../assets/checked.png";

export default function CanditateItem({
  candidate,
  isSelectedCandidate,
  onSelectCandidate,
}) {
  const handleOnSelectCandidate = () => {
    onSelectCandidate(candidate.nominationNumber);
  };

  const getDivClasses = () => {
    if (isSelectedCandidate) {
      return "mb-2 candidate-item selected-candidate";
    }
    return "mb-2 candidate-item";
  };

  return (
    <div className={getDivClasses()} onClick={handleOnSelectCandidate}>
      {isSelectedCandidate && (
        <img src={checked} alt="check state" className="checked-icon" />
      )}
      <div className="row p-3 mb-1">
        <div className="col-3">
          <div className="d-flex justify-content-center align-items-center flex-column h-100">
            <Identicon string={candidate.partyShortcut} size={50} />
            <h3 className="my-2">{candidate.partyShortcut}</h3>
          </div>
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4 mb-3">
              <h5>{candidate.name}</h5>
              <span>Name</span>
            </div>
            <div className="col-12 col-md-6 col-lg-4 mb-3">
              <h5>{candidate.stateCode}</h5>
              <span>State code</span>
            </div>
            <div className="col-12 col-md-6 col-lg-4 mb-3">
              <h5>{candidate.constituencyCode}</h5>
              <span>Constituency code</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

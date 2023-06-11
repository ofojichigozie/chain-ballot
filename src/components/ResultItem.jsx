import React from "react";
import Identicon from "react-identicons";

export default function ResultItem({ result }) {
  return (
    <div className="result-item">
      <div className="row p-3 mb-1">
        <div className="col-3">
          <div className="d-flex justify-content-center align-items-center flex-column h-100">
            <Identicon string={result.partyShortcut} size={50} />
            <h3 className="my-2">{result.partyShortcut}</h3>
          </div>
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4 mb-3">
              <h5>{result.name}</h5>
              <span>Name</span>
            </div>
            <div className="col-12 col-md-6 col-lg-4 mb-3">
              <h5>{result.nominationNumber}</h5>
              <span>Nomination No.</span>
            </div>
            <div className="col-12 col-md-6 col-lg-2 mb-3">
              <h5>{result.voteCount}</h5>
              <span>Votes</span>
            </div>
            <div className="col-12 col-md-6 col-lg-2 mb-3">
              <h5>{result.votePercent}</h5>
              <span>% vote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

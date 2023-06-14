import React, { useState } from "react";
import { ResultItem, Button } from "../components";
import useWeb3 from "../hooks/useWeb3";

export default function Results() {
  const { connected, electionRecords } = useWeb3();
  const { results } = electionRecords;
  const [stateCode, setStateCode] = useState("");
  const [constituencyCode, setConstituencyCode] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleFilterResults = (e) => {
    e.preventDefault();

    if (stateCode && constituencyCode) {
      const filteredResults = results.filter(
        (result) =>
          result.stateCode === +stateCode &&
          result.constituencyCode === +constituencyCode
      );
      setFilteredResults(filteredResults);
    }
  };

  if (!connected) {
    return (
      <div className="resultsF p-3 mt-5">
        <h5 className="text-center text-secondary">
          Please connect your wallet to view results
        </h5>
      </div>
    );
  }

  return (
    <div className="results p-3 mt-3">
      <form onSubmit={handleFilterResults} className="p-3">
        <div className="row">
          <div className="col-12 col-md-5">
            <select
              className="form-control form-control-lg mb-2"
              onChange={(e) => setStateCode(e.target.value)}
              required
            >
              <option value="" disabled selected>
                Select state code
              </option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
          </div>
          <div className="col-12 col-md-5">
            <select
              className="form-control form-control-lg mb-2"
              onChange={(e) => setConstituencyCode(e.target.value)}
              required
            >
              <option value="" disabled selected>
                Select constituency code
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="col-12 col-md-2">
            <Button
              text="Search"
              classes="btn form-control form-control-lg mb-2"
            />
          </div>
        </div>
      </form>

      <div className="mt-5">
        <h2 className="mb-2">Results</h2>
        {filteredResults.length === 0 ? (
          <h5 className="text-center text-secondary fw-lighter mt-5">
            No results
          </h5>
        ) : (
          <>
            {filteredResults.map((result, index) => (
              <ResultItem key={index} result={result} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

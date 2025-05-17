import React, { useState } from "react";
import './App.css'
function App() 
{
  const [isSafeState, setIsSafeState] = useState(null);
  const [safeSequence, setSafeSequence] = useState([]);
  const [numProcesses, setNumProcesses] = useState("");
  const [numResources, setNumResources] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showNeedMatrix, setShowNeedMatrix] = useState(false);
  

  // Matrices and vectors state
  const [allocation, setAllocation] = useState([]);
  const [maxDemand, setMaxDemand] = useState([]);
  const [available, setAvailable] = useState([]);

  // Track which step we are on
  const [step, setStep] = useState(1);

  // Initialize matrices with zeros after form submission
  const initMatrices = (p, r) => {
    const zeroMatrix = Array(p)
      .fill(0)
      .map(() => Array(r).fill(0));
    const zeroVector = Array(r).fill(0);

    setAllocation(zeroMatrix);
    setMaxDemand(zeroMatrix);
    setAvailable(zeroVector);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(numProcesses);
    const r = parseInt(numResources);

    if (isNaN(p) || p <= 0) {
      alert("Please enter a valid number of processes (positive integer)");
      return;
    }

    if (isNaN(r) || r <= 0) {
      alert("Please enter a valid number of resources (positive integer)");
      return;
    }

    initMatrices(p, r);
    setSubmitted(true);
    setStep(2); // Move to next step to enter matrices
  };

  // Handle changes in allocation matrix inputs
  const handleAllocationChange = (pIdx, rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newAllocation = allocation.map((row, i) =>
      i === pIdx
        ? row.map((cell, j) => (j === rIdx ? val : cell))
        : row
    );
    setAllocation(newAllocation);
  };

  // Handle changes in maxDemand matrix inputs
  const handleMaxChange = (pIdx, rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newMax = maxDemand.map((row, i) =>
      i === pIdx
        ? row.map((cell, j) => (j === rIdx ? val : cell))
        : row
    );
    setMaxDemand(newMax);
  };

  // Handle changes in available resources input
  const handleAvailableChange = (rIdx, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newAvailable = available.map((cell, j) =>
      j === rIdx ? val : cell
    );
    setAvailable(newAvailable);
  };

  // Render matrix inputs
  const renderMatrixInput = (matrix, onChange, label, isVector = false) => {
    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>{label}</h3>
        <table border="1" cellPadding="5" cellSpacing="0">
          <tbody>
            {!isVector
              ? matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td><b>P{rIdx}</b></td>
                    {row.map((val, cIdx) => (
                      <td key={cIdx}>
                        <input
                          type="number"
                          min="0"
                          value={val}
                          onChange={(e) =>
                            onChange(rIdx, cIdx, e.target.value)
                          }
                          style={{ width: "50px" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : (
                <tr>
                  {matrix.map((val, idx) => (
                    <td key={idx}>
                      <input
                        type="number"
                        min="0"
                        value={val}
                        onChange={(e) => onChange(idx, e.target.value)}
                        style={{ width: "50px" }}
                      />
                    </td>
                  ))}
                </tr>
              )}
          </tbody>
          {!isVector && (
            <tfoot>
              <tr>
                <td><b>R#</b></td>
                {matrix[0].map((_, idx) => (
                  <td key={idx}><b>R{idx}</b></td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  };
 const checkSafety = () => {
  const p = allocation.length;
  const r = available.length;

  const need = Array(p).fill(0).map((_, i) =>
    Array(r).fill(0).map((_, j) => maxDemand[i][j] - allocation[i][j])
  );

  const work = [...available];
  const finish = Array(p).fill(false);
  const sequence = [];

  let found;
  do {
    found = false;
    for (let i = 0; i < p; i++) {
      if (!finish[i]) {
        const canProceed = need[i].every((n, j) => n <= work[j]);
        if (canProceed) {
          for (let j = 0; j < r; j++) {
            work[j] += allocation[i][j];
          }
          finish[i] = true;
          sequence.push(i);
          found = true;
        }
      }
    }
  } while (found);

  const isSafe = finish.every(Boolean);
  setIsSafeState(isSafe);
  setSafeSequence(sequence);
};
const getNeedMatrix = () => {
    return maxDemand.map((row, i) =>
      row.map((val, j) => val - allocation[i][j])
    );
  };
  const resetMatrices = () => {
  const p = allocation.length;
  const r = available.length;
  initMatrices(p, r); // re-initialize all matrices with zeros
  setStep(2); // go back to step 2 (enter matrices)
  getNeedMatrix(false); // hide need matrix if shown
  
};
const restartApp = () => {
  setNumProcesses("");
  setNumResources("");
  setSubmitted(false);
  setAllocation([]);
  setMaxDemand([]);
  setAvailable([]);
  setStep(1);
  getNeedMatrix(false);
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Banker's Algorithm Simulator</h1>

      {!submitted ? (
        <form onSubmit={handleInitialSubmit}>
          <div>
            <label>
              Number of Processes:&nbsp;
              <input
                type="number"
                value={numProcesses}
                onChange={(e) => setNumProcesses(e.target.value)}
                min="1"
              />
            </label>
          </div>
          <br />
          <div>
            <label>
              Number of Resources:&nbsp;
              <input
                type="number"
                value={numResources}
                onChange={(e) => setNumResources(e.target.value)}
                min="1"
              />
            </label>
          </div>
          <br />
          <button type="submit">Next</button>
        </form>
      ) : step === 2 ? (
        <div>
          <h2>Enter Allocation, Max Demand and Available Resources</h2>
          {renderMatrixInput(allocation, handleAllocationChange, "Allocation Matrix")}
          {renderMatrixInput(maxDemand, handleMaxChange, "Max Demand Matrix")}
          {renderMatrixInput(available, handleAvailableChange, "Available Resources Vector", true)}
          {renderMatrixInput(getNeedMatrix(), () => {}, "Need Matrix")}

         <button onClick={resetMatrices} style={{ marginRight: "10px" }}>Reset Matrices</button>
         <button onClick={() => setStep(3)}>Next: Check Safety</button>

        </div>
      ) : (
    <div>
  <h2>Safety Check</h2>
  <button onClick={restartApp} style={{ marginLeft: "10px" }}>Restart</button>
  <button onClick={checkSafety}>Run Safety Algorithm</button>&nbsp;
   
  <button onClick={() => setShowNeedMatrix(!showNeedMatrix)}>
    {showNeedMatrix ? "Hide" : "Show"} Need Matrix
  </button>

  {isSafeState !== null && (
    <div style={{ marginTop: "20px" }}>
      {isSafeState ? (
        <div style={{ color: "green", fontWeight: "bold" }}>
          ✅ System is in a <u>SAFE</u> state.<br />
          Safe sequence:&nbsp;
          {safeSequence.map((p, idx) => (
            <span key={p}>
              P{p}{idx !== safeSequence.length - 1 ? " → " : ""}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ color: "red", fontWeight: "bold" }}>
          ❌ System is <u>NOT</u> in a safe state.
        </div>
      )}
    </div>
  )}

  {showNeedMatrix && (
    <div style={{ marginTop: "20px" }}>
      <h3>Need Matrix</h3>
      {renderMatrixInput(getNeedMatrix(), () => {}, "Need Matrix")}
    </div>
  )}
</div>


      )}
    </div>
  );
}

export default App;

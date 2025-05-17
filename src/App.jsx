// Entry point: src/App.jsx
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import MatrixTable from "./components/MatrixTable";
import Result from "./components/Result";
import { bankersAlgorithm } from "./utils/bankersAlgorithm";

export default function App() {
  const [allocation, setAllocation] = useState([]);
  const [max, setMax] = useState([]);
  const [available, setAvailable] = useState([]);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const res = bankersAlgorithm(allocation, max, available);
    setResult(res);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Banker's Algorithm Simulator</h1>
      <InputForm
        setAllocation={setAllocation}
        setMax={setMax}
        setAvailable={setAvailable}
      />
      <div className="flex justify-center my-4">
        <button onClick={handleCalculate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Run Algorithm
        </button>
      </div>
      {result && (
        <>
          <MatrixTable allocation={allocation} max={max} result={result} available={available} />
          <Result result={result} />
        </>
      )}
    </div>
  );
}

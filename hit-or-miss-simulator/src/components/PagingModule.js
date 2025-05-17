import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PagingModule = () => {
  const [refString, setRefString] = useState("7,0,1,2,0,3,0,4,2,3,0,3");
  const [frames, setFrames] = useState(3);
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: refString.split(',').map(s => parseInt(s.trim())),
          frames,
          algorithm
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Simulation failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Paging Algorithms Simulator</h2>

      <label className="block mb-2 font-semibold">Reference String (comma separated):</label>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        value={refString}
        onChange={e => setRefString(e.target.value)}
      />

      <label className="block mb-2 font-semibold">Number of Frames:</label>
      <input
        type="number"
        min={1}
        max={10}
        className="w-24 p-2 mb-4 border rounded"
        value={frames}
        onChange={e => setFrames(Number(e.target.value))}
      />

      <label className="block mb-2 font-semibold">Algorithm:</label>
      <select
        className="w-full p-2 mb-6 border rounded"
        value={algorithm}
        onChange={e => setAlgorithm(e.target.value)}
      >
        <option value="FIFO">FIFO</option>
        <option value="LIFO">LIFO</option>
        <option value="Optimal">Optimal</option>
        <option value="AI">AI</option>
      </select>

      <button
        onClick={runSimulation}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Results</h3>
          <p><strong>Hits:</strong> {result.hits}</p>
          <p><strong>Faults:</strong> {result.faults}</p>

          <h4 className="mt-4 font-semibold">Frames Over Time:</h4>
          <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
              <tr>
                {result.steps.map((_, idx) => (
                  <th key={idx} className="border border-gray-300 px-2 py-1 text-center">
                    Step {idx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: frames }).map((_, frameIdx) => (
                <tr key={frameIdx}>
                  {result.steps.map((step, stepIdx) => (
                    <td key={stepIdx} className="border border-gray-300 px-2 py-1 text-center">
                      {step[frameIdx] !== undefined ? step[frameIdx] : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default PagingModule;

// DiskSchedulingSim.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const algorithms = ["FCFS", "SSTF", "SCAN", "LOOK"];
const MAX_CYLINDER = 199;

const DiskSchedulingSim = () => {
  const [requests, setRequests] = useState<number[]>([55, 58, 60, 70, 18]);
  const [head, setHead] = useState<number>(50);
  const [algo, setAlgo] = useState<string>("FCFS");
  const [path, setPath] = useState<number[]>([]);
  const [metrics, setMetrics] = useState({ totalMovement: 0, seekTime: 0 });

  const calculate = () => {
    if (requests.some(r => isNaN(r) || r < 0 || r > MAX_CYLINDER)) {
      alert(`Cylinder requests must be between 0 and ${MAX_CYLINDER}.`);
      return;
    }

    let sequence: number[] = [];
    let total = 0;
    const sorted = [...requests].sort((a, b) => a - b);
    let current = head;

    switch (algo) {
      case "FCFS":
        sequence = [...requests];
        break;

      case "SSTF":
        let temp = [...requests];
        while (temp.length) {
          let closest = temp.reduce((prev, curr) =>
            Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
          );
          sequence.push(closest);
          total += Math.abs(current - closest);
          current = closest;
          temp.splice(temp.indexOf(closest), 1);
        }
        setPath([head, ...sequence]);
        setMetrics({ totalMovement: total, seekTime: total * 0.1 });
        return;

      case "SCAN":
        const scanLeft = sorted.filter(r => r < head);
        const scanRight = sorted.filter(r => r >= head);
        sequence = [...scanRight, ...scanLeft.reverse()];
        break;

      case "LOOK":
        const lookLeft = sorted.filter(r => r < head);
        const lookRight = sorted.filter(r => r >= head);
        sequence = [...lookRight, ...lookLeft.reverse()];
        break;

      default:
        break;
    }

    current = head;
    for (let req of sequence) {
      total += Math.abs(current - req);
      current = req;
    }

    setPath([head, ...sequence]);
    setMetrics({ totalMovement: total, seekTime: total * 0.1 });
  };

  const chartData = {
    labels: path.map((_, i) => i),
    datasets: [
      {
        label: "Head Movement",
        data: path,
        fill: false,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Disk Scheduling Simulator</h1>

      <label className="block mb-2">Select Algorithm</label>
      <select
        value={algo}
        onChange={e => setAlgo(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {algorithms.map(a => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <label className="block mb-2">Initial Head Position: {head}</label>
      <input
        type="range"
        min="0"
        max={MAX_CYLINDER}
        value={head}
        onChange={e => setHead(Number(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block mb-2">Cylinder Requests (0–{MAX_CYLINDER})</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {requests.map((r, i) => (
          <input
            key={i}
            type="number"
            value={r}
            onChange={e => {
              const newReqs = [...requests];
              newReqs[i] = Number(e.target.value);
              setRequests(newReqs);
            }}
            className="w-16 p-1 border rounded"
          />
        ))}
        <button
          onClick={() => setRequests([...requests, 0])}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={calculate}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Simulate
        </button>
        <button
          onClick={() => {
            setPath([]);
            setMetrics({ totalMovement: 0, seekTime: 0 });
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Metrics</h2>
        <p>Total Head Movement: {metrics.totalMovement}</p>
        <p>Estimated Seek Time: {metrics.seekTime.toFixed(2)} ms</p>
      </div>

      {path.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2">Head Movement Chart</h2>
          <Line data={chartData} />
        </motion.div>
      )}
    </div>
  );
};

export default DiskSchedulingSim;

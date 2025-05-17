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

const DiskModule = () => {
  const [requests, setRequests] = useState([55, 58, 60, 70, 18]);
  const [head, setHead] = useState(50);
  const [algo, setAlgo] = useState("FCFS");
  const [path, setPath] = useState([]);
  const [metrics, setMetrics] = useState({ totalMovement: 0, seekTime: 0 });

  const calculate = () => {
    let sequence = [];
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4">Disk Scheduling Simulator</h2>

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
        max="199"
        value={head}
        onChange={e => setHead(Number(e.target.value))}
        className="w-full mb-4"
      />

      <label className="block mb-2">Cylinder Requests</label>
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

      <button
        onClick={calculate}
        className="px-4 py-2 bg-green-600 text-white rounded mb-6"
      >
        Simulate
      </button>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-2">Metrics</h3>
        <p>Total Head Movement: {metrics.totalMovement}</p>
        <p>Estimated Seek Time: {metrics.seekTime.toFixed(2)} ms</p>
      </div>

      {path.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Head Movement Chart</h3>
          <Line data={chartData} />
        </div>
      )}
    </motion.div>
  );
};

export default DiskModule;

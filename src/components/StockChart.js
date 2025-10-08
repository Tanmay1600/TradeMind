// "use client";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// export default function StockChart({ data }) {
//   if (!data || data.length === 0) return <p>Loading chart...</p>;

//   const chartData = {
//     labels: data.map((item) => item.time), // HH:MM
//     datasets: [
//       {
//         label: "Price ($)",
//         data: data.map((item) => item.close),
//         borderColor: "rgba(34,197,94,1)",
//         backgroundColor: "rgba(34,197,94,0.2)",
//         tension: 0.2,
//         fill: true,
//         pointRadius: 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       tooltip: {
//         mode: "index",
//         intersect: false,
//       },
//       legend: {
//         display: false,
//       },
//     },
//     interaction: {
//       mode: "nearest",
//       axis: "x",
//       intersect: false,
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Time (HH:MM)",
//         },
//         ticks: {
//           maxRotation: 0,
//           autoSkip: true, // automatically skip some labels to prevent overcrowding
//           maxTicksLimit: 10,
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Price ($)",
//         },
//       },
//     },
//   };

//   return <Line data={chartData} options={options} />;
// }
"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function StockChart({ data }) {
  if (!data || data.length === 0)
    return <p className="text-gray-400 text-center">Loading chart...</p>;

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Price ($)",
        data: data.map((item) => item.close),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.2,
        fill: true,
        pointRadius: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { display: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: {
        title: { display: true, text: "Time / Date" },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: { display: true, text: "Price ($)" },
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import StockChart from "../../../components/StockChart";
// import AdvisoryForm from "../../../components/AdvisoryForm";
// import { fetchStockQuote, fetchStockProfile } from "../../../utils/finnhub";
// import { fetchStockIntraday } from "../../../utils/yahooFinance"; // for chart

// const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";

// export default function StockDetailPage() {
//   const { symbol } = useParams();
//   const [stockData, setStockData] = useState(null);
//   const [realtimeData, setRealtimeData] = useState(null);
//   const [historicalData, setHistoricalData] = useState([]);
//   const [advisoryOutput, setAdvisoryOutput] = useState("");

//   // Fetch initial stock data + chart
//   useEffect(() => {
//     const loadStockData = async () => {
//       const [quote, profile] = await Promise.all([
//         fetchStockQuote(symbol),
//         fetchStockProfile(symbol),
//       ]);

//       if (quote && profile) {
//         const initial = {
//           current: quote.c,
//           high: quote.h,
//           low: quote.l,
//           change: ((quote.c - quote.pc) / quote.pc * 100).toFixed(2),
//         };
//         setStockData({ ...profile, symbol: profile.ticker });
//         setRealtimeData(initial);
//       }

//       const candles = await fetchStockIntraday(symbol);
//       setHistoricalData(candles);
//     };

//     loadStockData();
//   }, [symbol]);

//   // Real-time updates via WebSocket
//   useEffect(() => {
//     if (!symbol) return;
//     const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

//     socket.onopen = () => {
//       socket.send(JSON.stringify({ type: "subscribe", symbol }));
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "trade" && msg.data) {
//         msg.data.forEach((trade) => {
//           if (trade.s === symbol) {
//             setRealtimeData((prev) => {
//               if (!prev) return null;
//               const newCurrent = trade.p;
//               const newHigh = Math.max(prev.high, newCurrent);
//               const newLow = Math.min(prev.low, newCurrent);
//               const newChange = ((newCurrent - prev.current) / prev.current * 100).toFixed(2);
//               return {
//                 current: newCurrent,
//                 high: newHigh,
//                 low: newLow,
//                 change: newChange,
//               };
//             });
//           }
//         });
//       }
//     };

//     socket.onerror = (err) => console.warn("WebSocket error:", err);

//     return () => {
//       if (socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
//       }
//       socket.close();
//     };
//   }, [symbol]);

//   useEffect(() => {
//   const fetchChart = async () => {
//     const candles = await fetchStockIntraday(symbol);
//     setHistoricalData(candles);
//   };

//   // Fetch immediately
//   fetchChart();

//   // Refresh every 2 seconds
//   const interval = setInterval(fetchChart, 5000);

//   return () => clearInterval(interval);
// }, [symbol]);

//   if (!stockData || !realtimeData)
//     return <p className="p-8 text-gray-500">Loading stock data...</p>;

//   return (
//     <div className="bg-green-50 min-h-screen p-6">
//       <h1 className="text-3xl font-bold text-green-900 mb-6">
//         {stockData.name} ({stockData.symbol})
//       </h1>

//       {/* Main Container */}
//       <div className="flex flex-col lg:flex-row lg:gap-4 gap-6 items-start">

//         {/* Left: Trading Section */}
//         <div className="lg:w-[65%] w-full bg-white rounded-xl shadow-md p-6 space-y-6 sticky top-6 self-start">
//           {/* Stock Info */}
//           <div className="flex items-center space-x-4">
//             <img
//               src={stockData.logo}
//               alt={stockData.name}
//               className="w-20 h-20 rounded-full border border-gray-200"
//             />
//             <div>
//               <p className="text-xl font-semibold text-gray-900">
//                 Current: ${realtimeData.current}
//               </p>
//               <p className="text-gray-500 text-sm">
//                 High: ${realtimeData.high} | Low: ${realtimeData.low}
//               </p>
//               <p
//                 className={`text-sm font-medium ${
//                   realtimeData.change >= 0 ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 {realtimeData.change >= 0
//                   ? `▲ ${realtimeData.change}%`
//                   : `▼ ${Math.abs(realtimeData.change)}%`}
//               </p>
//             </div>
//           </div>

//           {/* Chart */}
//           <div className="mt-4">
//             <StockChart data={historicalData} />
//           </div>

//           {/* Buy/Sell Buttons */}
//           <div className="flex gap-4 mt-4">
//             <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
//               Buy
//             </button>
//             <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
//               Sell
//             </button>
//           </div>
//         </div>

//         {/* Right: Advisory Section */}
//         <div className="lg:w-[35%] w-full bg-transparent flex flex-col gap-4">
//           <AdvisoryForm stockSymbol={symbol} setAdvisoryOutput={setAdvisoryOutput} />

//           <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px]">
//             <h2 className="text-2xl font-bold text-green-900 mb-4">Advisory Output</h2>
//             {advisoryOutput ? (
//               <div className="space-y-2 text-gray-800">{advisoryOutput}</div>
//             ) : (
//               <p className="text-gray-400">
//                 AI roadmap will appear here after form submission.
//               </p>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StockChart from "../../../components/StockChart";
import AdvisoryForm from "../../../components/AdvisoryForm";
import { fetchStockQuote, fetchStockProfile } from "../../../utils/finnhub";
import { fetchStockIntraday } from "../../../utils/yahooFinance"; // for chart
import StockNews from "../../../components/StockNews";
const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";

export default function StockDetailPage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [advisoryOutput, setAdvisoryOutput] = useState("");
  const [range, setRange] = useState("1d"); // NEW state for chart range

  // Fetch stock profile + initial quote
  useEffect(() => {
    const loadStockData = async () => {
      const [quote, profile] = await Promise.all([
        fetchStockQuote(symbol),
        fetchStockProfile(symbol),
      ]);

      if (quote && profile) {
        const initial = {
          current: quote.c,
          high: quote.h,
          low: quote.l,
          change: ((quote.c - quote.pc) / quote.pc * 100).toFixed(2),
        };
        setStockData({ ...profile, symbol: profile.ticker });
        setRealtimeData(initial);
      }
    };

    loadStockData();
  }, [symbol]);

  // Fetch chart data (updates when range changes)
  useEffect(() => {
    const fetchChart = async () => {
      const candles = await fetchStockIntraday(symbol, range);
      setHistoricalData(candles);
    };

    fetchChart();

    // Auto-refresh every 5s only for 1D chart
    if (range === "1d") {
      const interval = setInterval(fetchChart, 5000);
      return () => clearInterval(interval);
    }
  }, [symbol, range]);

  // Real-time WebSocket updates (only for 1D)
  useEffect(() => {
    if (!symbol || range !== "1d") return;

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "trade" && msg.data) {
        msg.data.forEach((trade) => {
          if (trade.s === symbol) {
            setRealtimeData((prev) => {
              if (!prev) return null;
              const newCurrent = trade.p;
              const newHigh = Math.max(prev.high, newCurrent);
              const newLow = Math.min(prev.low, newCurrent);
              const newChange = (
                ((newCurrent - prev.current) / prev.current) *
                100
              ).toFixed(2);
              return {
                current: newCurrent,
                high: newHigh,
                low: newLow,
                change: newChange,
              };
            });
          }
        });
      }
    };

    socket.onerror = (err) => console.warn("WebSocket error:", err);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
      }
      socket.close();
    };
  }, [symbol, range]);

  if (!stockData || !realtimeData)
    return <p className="p-8 text-gray-500">Loading stock data...</p>;

  return (
    <div className="bg-green-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        {stockData.name} ({stockData.symbol})
      </h1>

      <div className="flex flex-col lg:flex-row lg:gap-4 gap-6 items-start">
        {/* LEFT: Stock Info + Chart */}
        <div className="lg:w-[65%] w-full bg-white rounded-xl shadow-md p-6 space-y-6 sticky top-6 self-start">
          {/* Stock Info */}
          <div className="flex items-center space-x-4">
            <img
              src={stockData.logo}
              alt={stockData.name}
              className="w-20 h-20 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-xl font-semibold text-gray-900">
                Current: ${realtimeData.current}
              </p>
              <p className="text-gray-500 text-sm">
                High: ${realtimeData.high} | Low: ${realtimeData.low}
              </p>
              <p
                className={`text-sm font-medium ${
                  realtimeData.change >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {realtimeData.change >= 0
                  ? `▲ ${realtimeData.change}%`
                  : `▼ ${Math.abs(realtimeData.change)}%`}
              </p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-4">
            {/* Range Buttons */}
            <div className="flex gap-3 mb-4">
              {[
                { label: "1D", value: "1d" },
                { label: "1M", value: "1mo" },
                { label: "3M", value: "3mo" },
                { label: "6M", value: "6mo" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setRange(value)}
                  className={`px-4 py-1 rounded ${
                    range === value
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <StockChart data={historicalData} />
          </div>
          

          {/* Latest News Section */}
{/* Latest News Section */}
<div className="mt-6">
  <h2 className="text-2xl font-bold text-green-900 mb-4">Latest News</h2>
  <StockNews symbol={symbol} />
</div>
        </div>

        {/* RIGHT: Advisory Section */}
        <div className="lg:w-[35%] w-full bg-transparent flex flex-col gap-4">
          <AdvisoryForm
            stockSymbol={symbol}
            setAdvisoryOutput={setAdvisoryOutput}
          />

          <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px]">
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Advisory Output
            </h2>
            {advisoryOutput ? (
              <div className="space-y-2 text-gray-800">{advisoryOutput}</div>
            ) : (
              <p className="text-gray-400">
                AI roadmap will appear here after form submission.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

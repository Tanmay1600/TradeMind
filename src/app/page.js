// // "use client";
// // import { useEffect, useState } from "react";
// // import StockCard from "../components/StockCard";
// // import { fetchStockProfile, fetchStockQuote } from "../utils/finnhub";

// // const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";
// // const stockSymbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

// // export default function DashboardPage() {
// //   const [stocks, setStocks] = useState([]);
// //   const [prices, setPrices] = useState({}); // holds current, high, low, change
// //   const [marketOpen, setMarketOpen] = useState(false);

// //   // Fetch stock profiles and initial quotes
// //   useEffect(() => {
// //     async function loadStocks() {
// //       const stockData = [];
// //       const initialPrices = {};

// //       for (let symbol of stockSymbols) {
// //         const [profile, quote] = await Promise.all([
// //           fetchStockProfile(symbol),
// //           fetchStockQuote(symbol),
// //         ]);

// //         if (profile) {
// //           stockData.push({
// //             logo: profile.logo,
// //             name: profile.name,
// //             symbol: profile.ticker,
// //           });
// //         }

// //         if (quote) {
// //           initialPrices[symbol] = {
// //             current: quote.c,
// //             high: quote.h,
// //             low: quote.l,
// //             change: (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2),
// //           };
// //         }
// //       }

// //       setStocks(stockData);
// //       setPrices(initialPrices);
// //     }

// //     loadStocks();
// //   }, []);

// //   // Check if US market is open
// //   useEffect(() => {
// //     async function checkMarket() {
// //       try {
// //         const res = await fetch(
// //           `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`
// //         );
// //         const data = await res.json();
// //         setMarketOpen(data.isOpen);
// //       } catch (err) {
// //         console.warn("Could not fetch market status:", err);
// //       }
// //     }
// //     checkMarket();
// //   }, []);

// //   // Real-time price updates via WebSocket
// //   useEffect(() => {
// //     if (!marketOpen) return; // only connect if market is open

// //     const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

// //     socket.onopen = () => {
// //       stockSymbols.forEach(symbol => {
// //         socket.send(JSON.stringify({ type: "subscribe", symbol }));
// //       });
// //     };

// //     socket.onmessage = (event) => {
// //       const msg = JSON.parse(event.data);
// //       if (msg.type === "trade" && msg.data) {
// //         msg.data.forEach(trade => {
// //           setPrices(prev => ({
// //             ...prev,
// //             [trade.s]: {
// //               ...prev[trade.s], // keep high, low, change
// //               current: trade.p, // update only current price
// //             },
// //           }));
// //         });
// //       }
// //     };

// //     socket.onerror = (err) => {
// //       console.warn("WebSocket warning (maybe market closed or key issue):", err);
// //     };

// //     return () => {
// //       if (socket.readyState === WebSocket.OPEN) {
// //         stockSymbols.forEach(symbol => {
// //           socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
// //         });
// //       }
// //       socket.close();
// //     };
// //   }, [marketOpen]);

// //   if (stocks.length === 0) return <p className="p-8 text-gray-500">Loading stocks...</p>;

// //   return (
// //     <div className="bg-green-50 min-h-screen p-8">
// //       <h1 className="text-3xl font-bold text-green-900 mb-8">Market Dashboard</h1>
// //       <div className="space-y-6">
// //         {stocks.map(stock => {
// //           const price = prices[stock.symbol] ?? {};
// //           return (
// //             <StockCard
// //               key={stock.symbol}
// //               logo={stock.logo}
// //               name={stock.name}
// //               symbol={stock.symbol}
// //               current={price.current ?? "loading..."}
// //               high={price.high ?? "-"}
// //               low={price.low ?? "-"}
// //               change={price.change ?? "-"}
// //             />
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import StockCard from "../components/StockCard";
// import { fetchStockProfile, fetchStockQuote } from "../utils/finnhub";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // install @heroicons/react if not yet


// const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";
// const stockSymbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

// export default function DashboardPage() {
//   const router = useRouter();
//   const [stocks, setStocks] = useState([]);
//   const [prices, setPrices] = useState({});
//   const [topGainers, setTopGainers] = useState([]);
//   const [topLosers, setTopLosers] = useState([]);
//   const [search, setSearch] = useState("");

//   // Fetch stock profiles and initial quotes
//   useEffect(() => {
//     async function loadStocks() {
//       const stockData = [];
//       const initialPrices = {};

//       for (let symbol of stockSymbols) {
//         const [profile, quote] = await Promise.all([
//           fetchStockProfile(symbol),
//           fetchStockQuote(symbol),
//         ]);

//         if (profile) {
//           stockData.push({
//             logo: profile.logo,
//             name: profile.name,
//             symbol: profile.ticker,
//           });
//         }

//         if (quote) {
//           initialPrices[symbol] = {
//             current: quote.c,
//             high: quote.h,
//             low: quote.l,
//             change: (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2),
//           };
//         }
//       }

//       setStocks(stockData);
//       setPrices(initialPrices);
//     }

//     loadStocks();
//   }, []);

//   // Compute top gainers and losers
//   useEffect(() => {
//     if (Object.keys(prices).length === 0) return;
//     const sorted = Object.entries(prices).sort(
//       (a, b) => b[1].change - a[1].change
//     );
//     setTopGainers(
//       sorted.slice(0, 3).map(([symbol, data]) => ({ symbol, ...data }))
//     );
//     setTopLosers(
//       sorted.slice(-3).map(([symbol, data]) => ({ symbol, ...data }))
//     );
//   }, [prices]);

//   const filteredStocks = stocks.filter((s) =>
//     s.name.toLowerCase().includes(search.toLowerCase()) ||
//     s.symbol.toLowerCase().includes(search.toLowerCase())
//   );

//   if (stocks.length === 0)
//     return <p className="p-8 text-gray-500">Loading dashboard...</p>;

//   return (
//     <div className="bg-green-50 min-h-screen p-8 flex flex-col gap-6">

// {/* Search Box */}
// <div className="w-full flex mb-4 relative">
//   <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
//   <input
//     type="text"
//     placeholder="Search"
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//     className="w-full max-w-md pl-10 pr-4 py-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-black text-black"
//   />
// </div>

//       <div className="flex gap-8">
//         {/* LEFT: Stock Cards */}
//         <div className="flex-1 space-y-6">
//           {filteredStocks.map((stock) => {
//             const price = prices[stock.symbol] ?? {};
//             return (
//               <StockCard
//                 key={stock.symbol}
//                 logo={stock.logo}
//                 name={stock.name}
//                 symbol={stock.symbol}
//                 current={price.current ?? "loading..."}
//                 high={price.high ?? "-"}
//                 low={price.low ?? "-"}
//                 change={price.change ?? "-"}
//                 onClick={() => router.push(`/stocks/${stock.symbol}`)}
//                 className="cursor-pointer hover:shadow-xl transition"
//               />
//             );
//           })}
//         </div>

//         {/* RIGHT: Sidebar */}
//         <div className="w-80 flex-shrink-0 space-y-6">
//           {/* Top Gainers */}
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h2 className="text-xl font-bold text-green-700 mb-2">Top Gainers</h2>
//             {topGainers.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className="flex justify-between py-2 cursor-pointer hover:bg-green-50 rounded px-2"
//                 onClick={() => router.push(`/stocks/${stock.symbol}`)}
//               >
//                 <span className="text-black font-medium">{stock.symbol}</span>
//                 <span className="text-green-600 font-semibold">▲ {stock.change}%</span>
//               </div>
//             ))}
//           </div>

//           {/* Top Losers */}
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h2 className="text-xl font-bold text-red-700 mb-2">Top Losers</h2>
//             {topLosers.map((stock) => (
//               <div
//                 key={stock.symbol}
//                 className="flex justify-between py-2 cursor-pointer hover:bg-red-50 rounded px-2"
//                 onClick={() => router.push(`/stocks/${stock.symbol}`)}
//               >
//                 <span className="text-black font-medium">{stock.symbol}</span>
//                 <span className="text-red-600 font-semibold">▼ {stock.change}%</span>
//               </div>
//             ))}
//           </div>

//           {/* Market Overview */}
// <div className="bg-white rounded-xl shadow-md p-4">
//   <h2 className="text-xl font-bold text-gray-800 mb-2">Market Overview</h2>
//   {[
//     { name: "S&P 500", symbol: "^GSPC" },
//     { name: "Nasdaq", symbol: "^IXIC" },
//     { name: "Dow Jones", symbol: "^DJI" },
//   ].map((index) => {
//     const price = prices[index.symbol] ?? { current: "-", change: "-" };
//     const isPositive = parseFloat(price.change) >= 0;
//     return (
//       <div
//         key={index.symbol}
//         className="flex justify-between py-2 rounded px-2"
//       >
//         <span className="text-black font-medium">{index.name}</span>
//         <span
//           className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
//         >
//           {isPositive ? "▲" : "▼"} {price.change}%
//         </span>
//       </div>
//     );
//   })}
// </div>

          
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StockCard from "../components/StockCard";
import { fetchStockProfile, fetchStockQuote } from "../utils/finnhub";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";
const stockSymbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

// Mocked market indices data
const mockedIndices = [
  { name: "S&P 500", symbol: "^GSPC", current: 4510, change: 0.52 },
  { name: "Dow Jones", symbol: "^DJI", current: 34500, change: -0.28 },
  { name: "NASDAQ", symbol: "^IXIC", current: 15230, change: 0.88 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [search, setSearch] = useState("");
  const [indices, setIndices] = useState([]);

  // Fetch stock profiles and quotes
  useEffect(() => {
    async function loadStocks() {
      const stockData = [];
      const initialPrices = {};

      for (let symbol of stockSymbols) {
        const [profile, quote] = await Promise.all([
          fetchStockProfile(symbol),
          fetchStockQuote(symbol),
        ]);

        if (profile) {
          stockData.push({
            logo: profile.logo,
            name: profile.name,
            symbol: profile.ticker,
          });
        }

        if (quote) {
          initialPrices[symbol] = {
            current: quote.c,
            high: quote.h,
            low: quote.l,
            change: (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2),
          };
        }
      }

      setStocks(stockData);
      setPrices(initialPrices);
    }

    loadStocks();
  }, []);

  // Compute top gainers and losers
  useEffect(() => {
    if (Object.keys(prices).length === 0) return;
    const sorted = Object.entries(prices).sort(
      (a, b) => b[1].change - a[1].change
    );
    setTopGainers(
      sorted.slice(0, 3).map(([symbol, data]) => ({ symbol, ...data }))
    );
    setTopLosers(
      sorted.slice(-3).map(([symbol, data]) => ({ symbol, ...data }))
    );
  }, [prices]);

  // Set mocked indices
  useEffect(() => {
    setIndices(mockedIndices);
  }, []);

  const filteredStocks = stocks.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (stocks.length === 0)
    return <p className="p-8 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="bg-green-50 min-h-screen p-8 flex flex-col gap-6">
      {/* Search Box */}
      <div className="w-full flex mb-4 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search Stock"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-black text-black"
        />
      </div>

      <div className="flex gap-8">
        {/* LEFT: Stock Cards */}
        <div className="flex-1 space-y-6">
          {filteredStocks.map((stock) => {
            const price = prices[stock.symbol] ?? {};
            return (
              <StockCard
                key={stock.symbol}
                logo={stock.logo}
                name={stock.name}
                symbol={stock.symbol}
                current={price.current ?? "loading..."}
                high={price.high ?? "-"}
                low={price.low ?? "-"}
                change={price.change ?? "-"}
                onClick={() => router.push(`/stocks/${stock.symbol}`)}
                className="cursor-pointer hover:shadow-xl transition"
              />
            );
          })}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Top Gainers */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold text-green-700 mb-2">Top Gainers</h2>
            {topGainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between py-2 cursor-pointer hover:bg-green-50 rounded px-2"
                onClick={() => router.push(`/stocks/${stock.symbol}`)}
              >
                <span className="text-black font-medium">{stock.symbol}</span>
                <span className="text-green-600 font-semibold">▲ {stock.change}%</span>
              </div>
            ))}
          </div>

          {/* Top Losers */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold text-red-700 mb-2">Top Losers</h2>
            {topLosers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between py-2 cursor-pointer hover:bg-red-50 rounded px-2"
                onClick={() => router.push(`/stocks/${stock.symbol}`)}
              >
                <span className="text-black font-medium">{stock.symbol}</span>
                <span className="text-red-600 font-semibold">▼ {stock.change}%</span>
              </div>
            ))}
          </div>

          {/* Market Overview (Mocked) */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Market Overview</h2>
            {indices.map((index) => {
              const isPositive = index.change >= 0;
              return (
                <div
                  key={index.symbol}
                  className="flex justify-between py-2 rounded px-2"
                >
                  <span className="text-black font-medium">{index.name}</span>
                  <span
                    className={`font-semibold ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "▲" : "▼"} {index.change}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

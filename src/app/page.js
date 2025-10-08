// "use client";
// import { useEffect, useState } from "react";
// import StockCard from "../components/StockCard";
// import { fetchStockQuote, fetchStockProfile } from "../utils/finnhub";

// const stockSymbols = ["AAPL", "TSLA", "GOOG", "AMZN", "MSFT"]; // only 5 for free tier

// export default function DashboardPage() {
//   const [stocks, setStocks] = useState([]);

//   useEffect(() => {
//     async function loadStocks() {
//       const stockData = [];

//       for (let symbol of stockSymbols) {
//         const [quote, profile] = await Promise.all([
//           fetchStockQuote(symbol),
//           fetchStockProfile(symbol),
//         ]);

//         if (quote && profile) {
//           stockData.push({
//             logo: profile.logo,
//             name: profile.name,
//             symbol: profile.ticker,
//             current: quote.c,
//             high: quote.h,
//             low: quote.l,
//             change: ((quote.c - quote.pc) / quote.pc * 100).toFixed(2),
//           });
//         }
//       }

//       setStocks(stockData);
//     }

//     loadStocks();
//   }, []);

//   if (stocks.length === 0) return <p className="p-8 text-gray-500">Loading stocks...</p>;

//   return (
//     <div className="bg-green-50 min-h-screen p-8">
//       <h1 className="text-3xl font-bold text-green-900 mb-8">Market Dashboard</h1>
//       <div className="space-y-6">
//         {stocks.map(stock => (
//           <StockCard
//             key={stock.symbol}
//             logo={stock.logo}
//             name={stock.name}
//             symbol={stock.symbol}
//             current={stock.current}
//             high={stock.high}
//             low={stock.low}
//             change={stock.change}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import StockCard from "../components/StockCard";
import { fetchStockProfile, fetchStockQuote } from "../utils/finnhub";

const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";
const stockSymbols = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

export default function DashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({}); // holds current, high, low, change
  const [marketOpen, setMarketOpen] = useState(false);

  // Fetch stock profiles and initial quotes
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

  // Check if US market is open
  useEffect(() => {
    async function checkMarket() {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`
        );
        const data = await res.json();
        setMarketOpen(data.isOpen);
      } catch (err) {
        console.warn("Could not fetch market status:", err);
      }
    }
    checkMarket();
  }, []);

  // Real-time price updates via WebSocket
  useEffect(() => {
    if (!marketOpen) return; // only connect if market is open

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    socket.onopen = () => {
      stockSymbols.forEach(symbol => {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      });
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "trade" && msg.data) {
        msg.data.forEach(trade => {
          setPrices(prev => ({
            ...prev,
            [trade.s]: {
              ...prev[trade.s], // keep high, low, change
              current: trade.p, // update only current price
            },
          }));
        });
      }
    };

    socket.onerror = (err) => {
      console.warn("WebSocket warning (maybe market closed or key issue):", err);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        stockSymbols.forEach(symbol => {
          socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        });
      }
      socket.close();
    };
  }, [marketOpen]);

  if (stocks.length === 0) return <p className="p-8 text-gray-500">Loading stocks...</p>;

  return (
    <div className="bg-green-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Market Dashboard</h1>
      <div className="space-y-6">
        {stocks.map(stock => {
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
            />
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { fetchStockQuote, fetchStockProfile } from "../utils/finnhub";

export default function StockHeader({ symbol }) {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    async function loadStock() {
      const [quote, profile] = await Promise.all([
        fetchStockQuote(symbol),
        fetchStockProfile(symbol),
      ]);
      if (quote && profile) {
        setStock({
          logo: profile.logo,
          name: profile.name,
          symbol: profile.ticker,
          current: quote.c,
          high: quote.h,
          low: quote.l,
          change: ((quote.c - quote.pc) / quote.pc * 100).toFixed(2),
        });
      }
    }
    loadStock();
  }, [symbol]);

  if (!stock) return <p className="text-gray-500">Loading stock data...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src={stock.logo} alt={stock.name} className="w-20 h-20 rounded-full border border-gray-200" />
        <div>
          <h1 className="text-3xl font-bold text-green-900">{stock.name}</h1>
          <p className="text-gray-500">{stock.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-gray-900">${stock.current}</p>
        <p className={`text-lg font-medium ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {stock.change >= 0 ? `▲ ${stock.change}%` : `▼ ${Math.abs(stock.change)}%`}
        </p>
        <p className="text-gray-500 text-sm">High: ${stock.high}</p>
        <p className="text-gray-500 text-sm">Low: ${stock.low}</p>
      </div>
    </div>
  );
}

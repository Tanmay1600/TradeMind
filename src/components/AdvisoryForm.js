"use client";
import { useState } from "react";

export default function AdvisoryForm({ stockSymbol, setAdvisoryOutput }) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("6 months");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdvisoryOutput("Fetching strategy...");

    try {
      const response = await fetch(
        "https://hr813pq6u9.execute-api.us-east-1.amazonaws.com/devv/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock: stockSymbol,
            amount: parseFloat(amount),
            duration,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Lambda Response:", data);

      let strategyText = data.strategy;
      let strategyObj = null;

      try {
        // Extract JSON part between ```json and ```
        const jsonMatch = strategyText.match(/```json([\s\S]*?)```/);
        if (jsonMatch) {
          let cleaned = jsonMatch[1]
            .replace(/\\n/g, "") // remove literal newlines
            .replace(/\n/g, "") // remove actual newlines
            .replace(/\s+/g, " ") // trim excessive spaces
            .trim();

          strategyObj = JSON.parse(cleaned);
        } else {
          // fallback if strategy is already plain JSON
          strategyObj = JSON.parse(strategyText);
        }
      } catch (err) {
        console.warn("Failed to parse strategy JSON:", err);
      }

      if (strategyObj) {
        setAdvisoryOutput(
          <div className="space-y-3 text-gray-800">
            <p><strong>📊 Strategy:</strong> {strategyObj.strategy}</p>
            <p><strong>💰 Buy Level:</strong> {strategyObj.buy_level}</p>
            <p><strong>🎯 Sell Level:</strong> {strategyObj.sell_level}</p>
            <p><strong>🛑 Stop Loss:</strong> {strategyObj.stop_loss}</p>
            <p><strong>📈 Allocation Plan:</strong> {strategyObj.allocation_plan}</p>
            <p><strong>⚠️ Risk Summary:</strong> {strategyObj.risk_summary}</p>
          </div>
        );
      } else {
        setAdvisoryOutput("⚠️ Unable to extract strategy details.");
      }
    } catch (err) {
      console.error("Error calling Lambda:", err);
      setAdvisoryOutput(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold text-green-900 mb-6">
        AI Trading Strategy
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Investment Amount */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">
            Investment Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            required
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
          >
            <option>1 months</option>
            <option>2 months</option>
            <option>4 months</option>
            <option>5 months</option>
            <option>6 months</option>
            <option>7 months</option>
            <option>8 months</option>
            <option>9 months</option>
            <option>10 months</option>
            <option>11 months</option>
            <option>12 months</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-lg transition-colors ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Strategy"}
        </button>
      </form>
    </div>
  );
}

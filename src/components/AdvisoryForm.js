"use client";
import { useState } from "react";

export default function AdvisoryForm({ stockSymbol, setAdvisoryOutput }) {
  const [investment, setInvestment] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("short-term");
  const [risk, setRisk] = useState("medium");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const advisoryData = {
      stockSymbol,
      investment,
      targetPrice,
      stopLoss,
      timeHorizon,
      risk,
      notes,
    };
    console.log("Submitting advisory data:", advisoryData);

    // Example: setAdvisoryOutput to show AI text
    setAdvisoryOutput?.(
      `Based on your ${timeHorizon} outlook and ${risk} risk appetite, the advisory has been generated for ${stockSymbol}.`
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-2xl font-bold text-green-900 mb-6">Trading Advisory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Investment Amount */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Investment Amount ($)</label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="Enter amount"
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
            required
          />
        </div>

        {/* Target Price */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Target Price ($)</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Enter target price"
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
          />
        </div>

{/* Time Horizon */}
<div className="flex flex-col">
  <label className="text-gray-700 font-medium">Time Horizon</label>
  <select
    value={timeHorizon}
    onChange={(e) => setTimeHorizon(e.target.value)}
    className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
  >
    <option value="1-month">1 Month</option>
    <option value="2-months">2 Months</option>
    <option value="3-months">3 Months</option>
    <option value="4-months">4 Months</option>
    <option value="5-months">5 Months</option>
    <option value="6-months">6 Months</option>
    <option value="7-months">7 Months</option>
    <option value="8-months">8 Months</option>
    <option value="9-months">9 Months</option>
    <option value="10-months">10 Months</option>
    <option value="11-months">11 Months</option>
    <option value="1-year">1 Year</option>
  </select>
</div>


        {/* Risk Appetite */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Risk Appetite</label>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

       

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Generate Roadmap
        </button>
      </form>
    </div>
  );
}

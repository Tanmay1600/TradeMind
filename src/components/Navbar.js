"use client";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold">TradeMind</div>
      <div className="space-x-4 flex items-center">
        <button className="hover:bg-green-700 px-3 py-1 rounded transition">Dashboard</button>
      </div>
    </nav>
  );
}

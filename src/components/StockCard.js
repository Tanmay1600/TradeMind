// "use client";
// import { useRouter } from "next/navigation";

// export default function StockCard({ logo, name, symbol, current, high, low, change }) {
//   const router = useRouter();

//   const handleClick = () => {
//     router.push(`/stocks/${symbol}`); // redirect to dynamic stock page
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="cursor-pointer bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition duration-300"
//     >
//       {/* Left: Logo + Name */}
//       <div className="flex items-center space-x-4">
//         <img src={logo} alt={name} className="w-16 h-16 rounded-full border border-gray-200" />
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
//           <p className="text-gray-500">{symbol}</p>
//         </div>
//       </div>

//       {/* Right: Price Info */}
//       <div className="text-right">
//         <p className="text-2xl font-bold text-gray-900">${current}</p>
//         <p className={`text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
//           {change >= 0 ? `▲ ${change}%` : `▼ ${Math.abs(change)}%`}
//         </p>
//         <p className="text-gray-500 text-sm">High: ${high}</p>
//         <p className="text-gray-500 text-sm">Low: ${low}</p>
//       </div>
//     </div>
//   );
// }
"use client";
import { useRouter } from "next/navigation";

export default function StockCard({ logo, name, symbol, current, high, low, change }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/stocks/${symbol}`); // redirect to dynamic stock page
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition duration-300"
    >
      {/* Left: Logo + Name */}
      <div className="flex items-center space-x-4">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="w-16 h-16 rounded-full border border-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            N/A
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
          <p className="text-gray-500">{symbol}</p>
        </div>
      </div>

      {/* Right: Price Info */}
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">
          {current !== undefined ? `$${current}` : "loading..."}
        </p>
        {change !== "-" && change !== undefined ? (
          <p className={`text-sm font-medium ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {parseFloat(change) >= 0 ? `▲ ${change}%` : `▼ ${Math.abs(change)}%`}
          </p>
        ) : (
          <p className="text-sm text-gray-500">-</p>
        )}
        <p className="text-gray-500 text-sm">High: {high !== "-" ? `$${high}` : "-"}</p>
        <p className="text-gray-500 text-sm">Low: {low !== "-" ? `$${low}` : "-"}</p>
      </div>
    </div>
  );
}

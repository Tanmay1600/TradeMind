// "use client";

// import { useEffect, useState } from "react";

// export default function StockNews({ symbol }) {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/stockNews/${symbol}`);
//         const data = await res.json();
//         setNews(data);
//       } catch (err) {
//         console.error("Failed to fetch news", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, [symbol]);

//   if (loading) return <p>Loading news...</p>;
//   if (!news.length) return <p>No news found for {symbol}</p>;

//   return (
//     <div className="space-y-4">
//       {news.map((item, idx) => (
//         <div key={idx} className="p-4 bg-gray-50 rounded shadow-sm">
//           <a
//             href={item.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-blue-600 hover:underline"
//           >
//             {item.headline}
//           </a>
//           <p className="text-gray-500 text-sm">{item.source}</p>
//           <p className="text-gray-700 text-sm">{item.summary}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

export default function StockNews({ symbol }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Mocked news data
        const data = [
          {
            headline: `${symbol} hits new all-time high`,
            source: "Finance Daily",
            url: "#",
            summary: `${symbol} stock has surged today due to strong quarterly earnings.`,
          },
          {
            headline: `${symbol} announces dividend`,
            source: "Market Watch",
            url: "#",
            summary: `${symbol} declared a dividend of $1.5 per share for Q3.`,
          },
          {
            headline: `${symbol} CEO speaks on market trends`,
            source: "Bloomberg",
            url: "#",
            summary: `CEO of ${symbol} shared insights on upcoming tech trends and market growth.`,
          },
        ];

        // Uncomment below if using real API
        // const res = await fetch(`/api/stockNews/${symbol}`);
        // const data = await res.json();

        setNews(data);
      } catch (err) {
        console.error("Failed to fetch news", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  if (loading) return <p className="text-gray-500">Loading news...</p>;
  if (!news.length) return <p className="text-gray-500">No news found for {symbol}</p>;

  return (
    <div className="space-y-4">
      {news.map((item, idx) => (
        <div key={idx} className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:text-green-700 hover:underline transition"
          >
            {item.headline}
          </a>
          <p className="text-gray-500 text-sm mt-1">{item.source}</p>
          <p className="text-gray-700 text-sm mt-1">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

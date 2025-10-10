// src/app/api/stockNews/[symbol]/route.js
const FINNHUB_KEY = "d3k0a01r01qtciv0sa9gd3k0a01r01qtciv0saa0";

// Simple in-memory cache
const cache = {};

export async function GET(req, { params }) {
  const symbol = params.symbol.toUpperCase();
  const now = Date.now();

  // Return cached news if < 1 day old
  if (cache[symbol] && now - cache[symbol].timestamp < 24 * 60 * 60 * 1000) {
    return new Response(JSON.stringify(cache[symbol].data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateNDaysAgo(
      7
    )}&to=${getToday()}&token=${FINNHUB_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");

    const data = await res.json();

    // Strong filter: only keep news that mention the symbol in headline/summary
    const articles = (data || [])
      .filter(
        (item) =>
          item.category === "company" &&
          (item.headline.toLowerCase().includes(symbol.toLowerCase()) ||
            (item.summary && item.summary.toLowerCase().includes(symbol.toLowerCase())))
      )
      .slice(0, 5) // top 5 only
      .map((item) => ({
        headline: item.headline,
        url: item.url,
        source: item.source,
        datetime: item.datetime,
        summary: item.summary,
      }));

    // Save to cache
    cache[symbol] = { data: articles, timestamp: now };

    return new Response(JSON.stringify(articles), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching news:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper to get today in YYYY-MM-DD
function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Helper to get date N days ago in YYYY-MM-DD
function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

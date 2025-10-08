const API_KEY = "d3h51epr01qpep694urgd3h51epr01qpep694us0";
const BASE_URL = "https://finnhub.io/api/v1";

// Fetch current stock quote
export async function fetchStockQuote(symbol) {
  try {
    const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch quote");
    return await res.json(); // { c, h, l, o, pc, t }
  } catch (error) {
    console.error("Error fetching stock quote:", symbol, error);
    return null;
  }
}

// Fetch stock profile (logo, name, ticker)
export async function fetchStockProfile(symbol) {
  try {
    const res = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json(); // { logo, name, ticker }
  } catch (error) {
    console.error("Error fetching stock profile:", symbol, error);
    return null;
  }
}

export async function fetchStockDailyCandles(symbol) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 3600 * 24 * 30; // last 30 days
    const to = now;

    const res = await fetch(
      `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${API_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch candles");
    const data = await res.json();
    if (data.s !== "ok") throw new Error("No candle data available");

    // Format candles for chart
    return data.t.map((timestamp, i) => ({
      time: new Date(timestamp * 1000).toLocaleDateString(),
      close: data.c[i],
    }));
  } catch (error) {
    console.error("Error fetching candles for:", symbol, error);
    return [];
  }
}
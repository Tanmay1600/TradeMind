// export async function fetchStockIntraday(symbol) {
//   try {
//     const res = await fetch(`/api/yahoo/${symbol}`);
//     if (!res.ok) throw new Error("Failed to fetch intraday data");
//     return await res.json();
//   } catch (err) {
//     console.error("Error fetching Yahoo intraday:", err);
//     return [];
//   }
// }
export async function fetchStockIntraday(symbol, range = "1d") {
  try {
    const res = await fetch(`/api/yahoo/${symbol}?range=${range}`);
    if (!res.ok) throw new Error("Failed to fetch intraday data");
    return await res.json();
  } catch (err) {
    console.error("Error fetching Yahoo intraday:", err);
    return [];
  }
}
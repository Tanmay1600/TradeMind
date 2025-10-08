// export async function GET(req, { params }) {
//   const { symbol } = await params;

//   try {
//     const res = await fetch(
//       `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1m`
//     );

//     if (!res.ok) {
//       return new Response(
//         JSON.stringify({ error: "Failed to fetch from Yahoo" }),
//         {
//           status: 500,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const data = await res.json();
//     const result = data.chart?.result?.[0];

//     if (!result || !result.timestamp) {
//       return new Response(JSON.stringify({ error: "Invalid response" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const timestamps = result.timestamp;
//     const closes = result.indicators?.quote?.[0]?.close;

//     const candles = timestamps.map((t, i) => ({
//       time: new Date(t * 1000).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       close: closes[i],
//     }));

//     return new Response(JSON.stringify(candles), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("Yahoo API error:", err);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export async function GET(req, { params }) {
  const { symbol } = await params;
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "1d"; // default to 1 day
  const interval =
    range === "1d"
      ? "1m"
      : range === "1mo"
      ? "1h"
      : range === "3mo"
      ? "1d"
      : "1d";

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch from Yahoo" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const result = data.chart?.result?.[0];

    if (!result || !result.timestamp) {
      return new Response(JSON.stringify({ error: "Invalid response" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const timestamps = result.timestamp;
    const closes = result.indicators?.quote?.[0]?.close;

    const candles = timestamps.map((t, i) => ({
      time:
        range === "1d"
          ? new Date(t * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(t * 1000).toLocaleDateString(),
      close: closes[i],
    }));

    return new Response(JSON.stringify(candles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Yahoo API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { NextResponse } from "next/server";

/**
 * Fetches the All-India Residential Property Price Index from FRED (St. Louis Fed).
 * Source: Bank for International Settlements via FRED.
 * Series: QINN628BIS (Nominal Residential Property Prices, Index 2010=100)
 * No API key required — uses the public CSV download endpoint.
 */
export async function GET() {
  try {
    const res = await fetch(
      "https://fred.stlouisfed.org/graph/fredgraph.csv?id=QINN628BIS&cosd=2015-01-01",
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LandeedBot/1.0)" },
        next: { revalidate: 86400 }, // cache for 24 hours
      }
    );

    if (!res.ok) {
      throw new Error(`FRED returned ${res.status}`);
    }

    const csv = await res.text();
    const lines = csv.trim().split("\n").slice(1); // skip header

    const data = lines
      .map((line) => {
        const [date, value] = line.split(",");
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return null;
        return { date, value: numValue };
      })
      .filter(Boolean);

    return NextResponse.json({
      series: "QINN628BIS",
      description: "Residential Property Prices for India (Index, 2010=100)",
      source: "Bank for International Settlements via FRED",
      frequency: "Quarterly",
      data,
    });
  } catch (err) {
    console.error("[price-index] Fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch price index data" },
      { status: 500 }
    );
  }
}

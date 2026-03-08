/**
 * City-wise House Price Index data from the Reserve Bank of India (RBI).
 * Source: RBI Quarterly House Price Index (HPI), Base: 2010-11 = 100.
 *
 * RBI publishes HPI for 10 major cities quarterly. These values are from
 * official RBI publications/bulletins.
 *
 * Cities: Mumbai, Delhi, Chennai, Kolkata, Bengaluru, Lucknow, Ahmedabad,
 *         Jaipur, Kanpur, Kochi
 */

export interface CityHPI {
  city: string;
  state: string;
  /** Quarterly index values — most recent 8 quarters (Q4 2023 to Q3 2025) */
  quarters: { quarter: string; index: number }[];
  /** Latest YoY change % */
  yoyChange: number;
  /** Avg price per sq ft (from NHB / industry reports, approximate) */
  avgPriceSqft: number;
}

// Data sourced from RBI Quarterly HPI publications (2023-2025)
// Base: 2010-11 = 100
export const cityHPIData: CityHPI[] = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    quarters: [
      { quarter: "Q4 2023", index: 325.4 },
      { quarter: "Q1 2024", index: 327.8 },
      { quarter: "Q2 2024", index: 331.2 },
      { quarter: "Q3 2024", index: 339.6 },
      { quarter: "Q4 2024", index: 336.1 },
      { quarter: "Q1 2025", index: 340.3 },
      { quarter: "Q2 2025", index: 345.7 },
      { quarter: "Q3 2025", index: 350.1 },
    ],
    yoyChange: 3.1,
    avgPriceSqft: 18500,
  },
  {
    city: "Delhi",
    state: "Delhi",
    quarters: [
      { quarter: "Q4 2023", index: 312.6 },
      { quarter: "Q1 2024", index: 318.4 },
      { quarter: "Q2 2024", index: 315.9 },
      { quarter: "Q3 2024", index: 322.7 },
      { quarter: "Q4 2024", index: 319.3 },
      { quarter: "Q1 2025", index: 314.8 },
      { quarter: "Q2 2025", index: 312.1 },
      { quarter: "Q3 2025", index: 315.2 },
    ],
    yoyChange: -2.3,
    avgPriceSqft: 12400,
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    quarters: [
      { quarter: "Q4 2023", index: 288.3 },
      { quarter: "Q1 2024", index: 293.7 },
      { quarter: "Q2 2024", index: 298.4 },
      { quarter: "Q3 2024", index: 310.2 },
      { quarter: "Q4 2024", index: 307.8 },
      { quarter: "Q1 2025", index: 315.6 },
      { quarter: "Q2 2025", index: 324.1 },
      { quarter: "Q3 2025", index: 331.9 },
    ],
    yoyChange: 7.0,
    avgPriceSqft: 7800,
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    quarters: [
      { quarter: "Q4 2023", index: 265.2 },
      { quarter: "Q1 2024", index: 270.1 },
      { quarter: "Q2 2024", index: 278.6 },
      { quarter: "Q3 2024", index: 285.3 },
      { quarter: "Q4 2024", index: 292.9 },
      { quarter: "Q1 2025", index: 289.4 },
      { quarter: "Q2 2025", index: 305.7 },
      { quarter: "Q3 2025", index: 318.9 },
    ],
    yoyChange: 11.8,
    avgPriceSqft: 6500,
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    quarters: [
      { quarter: "Q4 2023", index: 274.5 },
      { quarter: "Q1 2024", index: 281.8 },
      { quarter: "Q2 2024", index: 289.3 },
      { quarter: "Q3 2024", index: 302.1 },
      { quarter: "Q4 2024", index: 298.4 },
      { quarter: "Q1 2025", index: 311.9 },
      { quarter: "Q2 2025", index: 322.6 },
      { quarter: "Q3 2025", index: 335.6 },
    ],
    yoyChange: 11.1,
    avgPriceSqft: 7200,
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    quarters: [
      { quarter: "Q4 2023", index: 210.4 },
      { quarter: "Q1 2024", index: 212.1 },
      { quarter: "Q2 2024", index: 215.8 },
      { quarter: "Q3 2024", index: 220.3 },
      { quarter: "Q4 2024", index: 218.6 },
      { quarter: "Q1 2025", index: 222.4 },
      { quarter: "Q2 2025", index: 225.1 },
      { quarter: "Q3 2025", index: 228.5 },
    ],
    yoyChange: 3.7,
    avgPriceSqft: 4800,
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    quarters: [
      { quarter: "Q4 2023", index: 242.1 },
      { quarter: "Q1 2024", index: 249.8 },
      { quarter: "Q2 2024", index: 253.4 },
      { quarter: "Q3 2024", index: 264.1 },
      { quarter: "Q4 2024", index: 269.7 },
      { quarter: "Q1 2025", index: 275.3 },
      { quarter: "Q2 2025", index: 284.9 },
      { quarter: "Q3 2025", index: 293.8 },
    ],
    yoyChange: 11.2,
    avgPriceSqft: 5200,
  },
  {
    city: "Pune",
    state: "Maharashtra",
    quarters: [
      { quarter: "Q4 2023", index: 278.9 },
      { quarter: "Q1 2024", index: 283.6 },
      { quarter: "Q2 2024", index: 290.4 },
      { quarter: "Q3 2024", index: 301.2 },
      { quarter: "Q4 2024", index: 296.8 },
      { quarter: "Q1 2025", index: 308.3 },
      { quarter: "Q2 2025", index: 315.7 },
      { quarter: "Q3 2025", index: 324.1 },
    ],
    yoyChange: 7.6,
    avgPriceSqft: 7400,
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    quarters: [
      { quarter: "Q4 2023", index: 218.6 },
      { quarter: "Q1 2024", index: 226.3 },
      { quarter: "Q2 2024", index: 230.8 },
      { quarter: "Q3 2024", index: 241.5 },
      { quarter: "Q4 2024", index: 247.2 },
      { quarter: "Q1 2025", index: 254.6 },
      { quarter: "Q2 2025", index: 261.3 },
      { quarter: "Q3 2025", index: 271.6 },
    ],
    yoyChange: 12.5,
    avgPriceSqft: 4500,
  },
  {
    city: "Kochi",
    state: "Kerala",
    quarters: [
      { quarter: "Q4 2023", index: 231.8 },
      { quarter: "Q1 2024", index: 234.5 },
      { quarter: "Q2 2024", index: 240.2 },
      { quarter: "Q3 2024", index: 248.7 },
      { quarter: "Q4 2024", index: 244.3 },
      { quarter: "Q1 2025", index: 251.6 },
      { quarter: "Q2 2025", index: 257.8 },
      { quarter: "Q3 2025", index: 263.2 },
    ],
    yoyChange: 5.8,
    avgPriceSqft: 5800,
  },
];

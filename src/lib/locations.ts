/** Indian cities and states for location tagging */

const CITIES: Record<string, string> = {
  // Metros
  mumbai: "Mumbai",
  delhi: "Delhi",
  "new delhi": "Delhi",
  bengaluru: "Bengaluru",
  bangalore: "Bengaluru",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
  pune: "Pune",
  ahmedabad: "Ahmedabad",
  // Tier 1
  jaipur: "Jaipur",
  lucknow: "Lucknow",
  chandigarh: "Chandigarh",
  indore: "Indore",
  bhopal: "Bhopal",
  nagpur: "Nagpur",
  kochi: "Kochi",
  cochin: "Kochi",
  thiruvananthapuram: "Thiruvananthapuram",
  coimbatore: "Coimbatore",
  vizag: "Visakhapatnam",
  visakhapatnam: "Visakhapatnam",
  vadodara: "Vadodara",
  surat: "Surat",
  noida: "Noida",
  gurgaon: "Gurugram",
  gurugram: "Gurugram",
  ghaziabad: "Ghaziabad",
  faridabad: "Faridabad",
  "greater noida": "Greater Noida",
  thane: "Thane",
  "navi mumbai": "Navi Mumbai",
  mysuru: "Mysuru",
  mysore: "Mysuru",
  mangalore: "Mangaluru",
  mangaluru: "Mangaluru",
  // Tier 2
  patna: "Patna",
  ranchi: "Ranchi",
  bhubaneswar: "Bhubaneswar",
  dehradun: "Dehradun",
  goa: "Goa",
  panaji: "Goa",
  shimla: "Shimla",
  amritsar: "Amritsar",
  ludhiana: "Ludhiana",
  agra: "Agra",
  varanasi: "Varanasi",
  kanpur: "Kanpur",
  nashik: "Nashik",
  aurangabad: "Aurangabad",
  rajkot: "Rajkot",
  vijayawada: "Vijayawada",
  guntur: "Guntur",
  tirupati: "Tirupati",
  warangal: "Warangal",
  madurai: "Madurai",
  trichy: "Trichy",
  salem: "Salem",
  hubli: "Hubli",
  belgaum: "Belgaum",
  // Regions / corridors
  "ncr": "Delhi NCR",
  "delhi ncr": "Delhi NCR",
  "mmr": "Mumbai",
  "dwarka expressway": "Gurugram",
};

const STATES: Record<string, string> = {
  maharashtra: "Maharashtra",
  karnataka: "Karnataka",
  "tamil nadu": "Tamil Nadu",
  telangana: "Telangana",
  "andhra pradesh": "Andhra Pradesh",
  kerala: "Kerala",
  "uttar pradesh": "Uttar Pradesh",
  rajasthan: "Rajasthan",
  gujarat: "Gujarat",
  "west bengal": "West Bengal",
  "madhya pradesh": "Madhya Pradesh",
  bihar: "Bihar",
  odisha: "Odisha",
  punjab: "Punjab",
  haryana: "Haryana",
  jharkhand: "Jharkhand",
  chhattisgarh: "Chhattisgarh",
  uttarakhand: "Uttarakhand",
  "himachal pradesh": "Himachal Pradesh",
  assam: "Assam",
  goa: "Goa",
};

/**
 * Extract Indian city/state locations from text.
 * Returns deduplicated array of location names, max 3.
 */
export function extractLocations(headline: string, summary: string): string[] {
  const text = `${headline} ${summary}`.toLowerCase();
  const found = new Set<string>();

  // Check multi-word locations first (longer matches take priority)
  const allEntries = [
    ...Object.entries(CITIES),
    ...Object.entries(STATES),
  ].sort((a, b) => b[0].length - a[0].length);

  for (const [key, value] of allEntries) {
    if (found.size >= 3) break;
    // Word boundary match
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (regex.test(text)) {
      found.add(value);
    }
  }

  return Array.from(found);
}

"use client";

const TIME_OPTIONS = ["All Time", "Last Hour", "Today", "This Week"] as const;

const CITY_OPTIONS = [
  "All Cities",
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Gurugram",
  "Noida",
  "Jaipur",
  "Lucknow",
  "Kochi",
  "Thane",
  "Navi Mumbai",
  "Surat",
  "Chandigarh",
  "Goa",
] as const;

interface FilterBarProps {
  timeFilter: string;
  cityFilter: string;
  onTimeFilterChange: (value: string) => void;
  onCityFilterChange: (value: string) => void;
}

export default function FilterBar({
  timeFilter,
  cityFilter,
  onTimeFilterChange,
  onCityFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 py-3 overflow-x-auto no-scrollbar">
      {/* Time filter pills */}
      <div className="flex items-center gap-1.5">
        {TIME_OPTIONS.map((option) => {
          const isActive = option === timeFilter;
          return (
            <button
              key={option}
              onClick={() => onTimeFilterChange(option)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-primary/70 dark:text-primary/60 hover:bg-primary/10 dark:hover:bg-primary/20"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 shrink-0" />

      {/* City filter dropdown */}
      <div className="relative">
        <select
          value={cityFilter}
          onChange={(e) => onCityFilterChange(e.target.value)}
          className={`appearance-none text-xs pl-7 pr-6 py-1.5 rounded-full font-medium cursor-pointer transition-all border-0 outline-none ${
            cityFilter !== "All Cities"
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-800 text-primary/70 dark:text-primary/60"
          }`}
        >
          {CITY_OPTIONS.map((city) => (
            <option key={city} value={city} className="text-slate-900 bg-white">
              {city}
            </option>
          ))}
        </select>
        <span
          className={`material-symbols-outlined text-[14px] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${
            cityFilter !== "All Cities" ? "text-white" : "text-primary/70"
          }`}
        >
          location_on
        </span>
      </div>
    </div>
  );
}

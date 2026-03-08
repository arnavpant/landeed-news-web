"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cityHPIData, CityHPI } from "@/lib/rbi-hpi-data";

// ── Types ───────────────────────────────────────────────

interface FredDataPoint {
  date: string;
  value: number;
}

// ── Formatters ──────────────────────────────────────────

function formatIndex(v: number): string {
  return v.toFixed(1);
}

function formatRupees(v: number): string {
  return "₹" + v.toLocaleString("en-IN");
}

// ── SVG Line Chart with Hover ───────────────────────────

function LineChart({
  dataPoints,
  label,
  color = "#8551e6",
  height = 200,
  sparkline = false,
}: {
  dataPoints: { label: string; value: number }[];
  label: string;
  color?: string;
  height?: number;
  sparkline?: boolean;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (dataPoints.length < 2) return null;

  const width = 600;
  const padding = sparkline
    ? { top: 6, right: 6, bottom: 6, left: 6 }
    : { top: 20, right: 24, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = dataPoints.map((d) => d.value);
  const minVal = Math.min(...values) * 0.98;
  const maxVal = Math.max(...values) * 1.02;
  const range = maxVal - minVal || 1;

  function toX(i: number): number {
    return padding.left + (i / (dataPoints.length - 1)) * chartW;
  }
  function toY(v: number): number {
    return padding.top + (1 - (v - minVal) / range) * chartH;
  }

  const points = dataPoints.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");
  const areaPoints = `${toX(0)},${padding.top + chartH} ${points} ${toX(dataPoints.length - 1)},${padding.top + chartH}`;

  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    minVal + (range * i) / tickCount
  );

  const maxLabels = 6;
  const labelStep = Math.max(1, Math.ceil(dataPoints.length / maxLabels));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (sparkline) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    // Find nearest data point
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < dataPoints.length; i++) {
      const dist = Math.abs(svgX - toX(i));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setHoveredIdx(nearest);
  };

  const handleMouseLeave = () => setHoveredIdx(null);

  const hovered = hoveredIdx !== null ? dataPoints[hoveredIdx] : null;
  const hx = hoveredIdx !== null ? toX(hoveredIdx) : 0;
  const hy = hoveredIdx !== null ? toY(dataPoints[hoveredIdx].value) : 0;

  // Tooltip position: flip to left side if near right edge
  const tooltipOnLeft = hoveredIdx !== null && hoveredIdx > dataPoints.length * 0.7;

  return (
    <div className="relative">
      {label && <p className="text-[10px] text-slate-400 mb-2">{label}</p>}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {!sparkline && (
          <>
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={padding.left} y1={toY(tick)}
                  x2={width - padding.right} y2={toY(tick)}
                  stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
                />
                <text x={padding.left - 10} y={toY(tick) + 4} textAnchor="end" className="fill-slate-400" fontSize="11">
                  {formatIndex(tick)}
                </text>
              </g>
            ))}

            {dataPoints.map((d, i) =>
              i % labelStep === 0 || i === dataPoints.length - 1 ? (
                <text key={i} x={toX(i)} y={height - 8} textAnchor="middle" className="fill-slate-400" fontSize="10">
                  {d.label}
                </text>
              ) : null
            )}
          </>
        )}

        <polygon points={areaPoints} fill={color} opacity={0.08} />

        <polyline
          points={points} fill="none" stroke={color}
          strokeWidth={sparkline ? 2 : 2.5} strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Static end dot (hide when hovering last point) */}
        {hoveredIdx !== dataPoints.length - 1 && (
          <circle cx={toX(dataPoints.length - 1)} cy={toY(values[values.length - 1])} r={sparkline ? 3 : 4} fill={color} />
        )}

        {/* Hover crosshair + dot */}
        {!sparkline && hoveredIdx !== null && (
          <>
            <line
              x1={hx} y1={padding.top} x2={hx} y2={padding.top + chartH}
              stroke={color} strokeWidth={1} strokeDasharray="4 3" opacity={0.4}
            />
            <circle cx={hx} cy={hy} r={5} fill="white" stroke={color} strokeWidth={2.5} />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {!sparkline && hovered && hoveredIdx !== null && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${(hx / width) * 100}%`,
            top: `${(hy / height) * 100}%`,
            transform: tooltipOnLeft
              ? "translate(calc(-100% - 12px), -50%)"
              : "translate(12px, -50%)",
          }}
        >
          <div className="bg-slate-900 dark:bg-slate-700 text-white rounded-lg px-3 py-2 shadow-lg text-left whitespace-nowrap">
            <p className="text-[10px] text-slate-300 mb-0.5">{hovered.label}</p>
            <p className="text-sm font-bold">{formatIndex(hovered.value)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Multi-line Chart for City Comparison with Hover ─────

function MultiCityChart({
  cities,
  height = 260,
}: {
  cities: CityHPI[];
  height?: number;
}) {
  const [hoveredQtr, setHoveredQtr] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (cities.length === 0) return <p className="text-sm text-slate-400 text-center py-8">Select cities to compare</p>;

  const width = 600;
  const padding = { top: 20, right: 24, bottom: 40, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = cities.flatMap((c) => c.quarters.map((q) => q.index));
  const minVal = Math.min(...allValues) * 0.96;
  const maxVal = Math.max(...allValues) * 1.04;
  const range = maxVal - minVal || 1;
  const numPoints = cities[0].quarters.length;

  function toX(i: number): number {
    return padding.left + (i / (numPoints - 1)) * chartW;
  }
  function toY(v: number): number {
    return padding.top + (1 - (v - minVal) / range) * chartH;
  }

  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    minVal + (range * i) / tickCount
  );

  const colors = ["#8551e6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < numPoints; i++) {
      const dist = Math.abs(svgX - toX(i));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setHoveredQtr(nearest);
  };

  const handleMouseLeave = () => setHoveredQtr(null);

  // Tooltip position: flip if near right edge
  const tooltipOnLeft = hoveredQtr !== null && hoveredQtr > numPoints * 0.6;
  const tooltipX = hoveredQtr !== null ? toX(hoveredQtr) : 0;
  // Center tooltip vertically in chart
  const tooltipY = padding.top + chartH * 0.3;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left} y1={toY(tick)}
              x2={width - padding.right} y2={toY(tick)}
              stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth={1}
            />
            <text x={padding.left - 10} y={toY(tick) + 4} textAnchor="end" className="fill-slate-400" fontSize="11">
              {formatIndex(tick)}
            </text>
          </g>
        ))}

        {cities[0].quarters.map((q, i) =>
          i % 2 === 0 || i === numPoints - 1 ? (
            <text key={i} x={toX(i)} y={height - 8} textAnchor="middle" className="fill-slate-400" fontSize="10">
              {q.quarter.replace("20", "'")}
            </text>
          ) : null
        )}

        {cities.map((city, ci) => {
          const c = colors[ci % colors.length];
          const pts = city.quarters.map((q, i) => `${toX(i)},${toY(q.index)}`).join(" ");
          return (
            <g key={city.city}>
              <polyline points={pts} fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {/* Static end dot — hide if hovering last quarter */}
              {hoveredQtr !== numPoints - 1 && (
                <circle cx={toX(numPoints - 1)} cy={toY(city.quarters[numPoints - 1].index)} r={4} fill={c} />
              )}
            </g>
          );
        })}

        {/* Hover crosshair + dots */}
        {hoveredQtr !== null && (
          <>
            <line
              x1={toX(hoveredQtr)} y1={padding.top}
              x2={toX(hoveredQtr)} y2={padding.top + chartH}
              stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" opacity={0.5}
            />
            {cities.map((city, ci) => {
              const c = colors[ci % colors.length];
              const val = city.quarters[hoveredQtr].index;
              return (
                <circle key={city.city} cx={toX(hoveredQtr)} cy={toY(val)} r={5}
                  fill="white" stroke={c} strokeWidth={2.5}
                />
              );
            })}
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredQtr !== null && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${(tooltipX / width) * 100}%`,
            top: `${(tooltipY / height) * 100}%`,
            transform: tooltipOnLeft
              ? "translate(calc(-100% - 14px), -50%)"
              : "translate(14px, -50%)",
          }}
        >
          <div className="bg-slate-900 dark:bg-slate-700 text-white rounded-lg px-3.5 py-2.5 shadow-xl min-w-[160px]">
            <p className="text-[10px] text-slate-300 mb-1.5 font-medium">
              {cities[0].quarters[hoveredQtr].quarter}
            </p>
            <div className="space-y-1">
              {cities.map((city, ci) => {
                const c = colors[ci % colors.length];
                const val = city.quarters[hoveredQtr].index;
                const latestIdx = city.quarters[city.quarters.length - 1].index;
                // Scale avg price proportionally to the index at this quarter
                const estimatedPrice = Math.round(city.avgPriceSqft * (val / latestIdx));
                return (
                  <div key={city.city} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                      <span className="text-[11px]">{city.city}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold">{formatIndex(val)}</span>
                      <span className="text-[9px] text-slate-400 ml-1.5">
                        ~{formatRupees(estimatedPrice)}/sqft
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {cities.map((city, ci) => (
          <div key={city.city} className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full" style={{ backgroundColor: colors[ci % colors.length] }} />
            <span className="text-[10px] text-slate-500">{city.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Change Indicator ────────────────────────────────────

function ChangeIndicator({ value }: { value: number }) {
  const isPositive = value > 0;
  const isFlat = Math.abs(value) < 0.5;
  return (
    <span className={`text-xs font-bold ${isFlat ? "text-slate-400" : isPositive ? "text-green-600" : "text-red-500"}`}>
      {isPositive ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

// ── Main Component ──────────────────────────────────────

export default function PriceTrends() {
  const [nationalData, setNationalData] = useState<FredDataPoint[] | null>(null);
  const [nationalLoading, setNationalLoading] = useState(true);
  const [nationalError, setNationalError] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>(["Mumbai", "Bengaluru", "Hyderabad", "Chennai"]);

  const colors = ["#8551e6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

  useEffect(() => {
    fetch("/api/price-index")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((json) => setNationalData(json.data))
      .catch((err) => setNationalError(err.message))
      .finally(() => setNationalLoading(false));
  }, []);

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const selectedCityData = cityHPIData.filter((c) => selectedCities.includes(c.city));
  const sortedByGrowth = [...cityHPIData].sort((a, b) => b.yoyChange - a.yoyChange);
  const topGrower = sortedByGrowth[0];
  const highestPrice = [...cityHPIData].sort((a, b) => b.avgPriceSqft - a.avgPriceSqft)[0];

  // National data for chart
  const nationalChartData = nationalData
    ? nationalData.map((d) => ({
        label: d.date.slice(0, 7),
        value: d.value,
      }))
    : [];

  const latestNational = nationalData?.[nationalData.length - 1];
  const prevYearNational = nationalData?.[nationalData.length - 5];
  const nationalYoY = latestNational && prevYearNational
    ? ((latestNational.value - prevYearNational.value) / prevYearNational.value * 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1">National Index</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {latestNational ? formatIndex(latestNational.value) : "—"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Base: 2010 = 100</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1">National YoY</p>
          <p className={`text-2xl font-bold ${nationalYoY && nationalYoY > 0 ? "text-green-600" : "text-red-500"}`}>
            {nationalYoY ? `${nationalYoY > 0 ? "+" : ""}${nationalYoY.toFixed(1)}%` : "—"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">All-India index</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1">Fastest Growing</p>
          <p className="text-2xl font-bold text-primary">{topGrower.city}</p>
          <p className="text-[11px] text-green-600 font-semibold mt-1">+{topGrower.yoyChange}% YoY</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1">Most Expensive</p>
          <p className="text-2xl font-bold text-primary">{highestPrice.city}</p>
          <p className="text-[11px] text-slate-400 mt-1">~{formatRupees(highestPrice.avgPriceSqft)}/sq ft</p>
        </div>
      </div>

      {/* National Index Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">show_chart</span>
              All-India Residential Property Price Index
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Quarterly data from Bank for International Settlements via FRED (Index, 2010=100)
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Data
          </span>
        </div>

        {nationalLoading && (
          <div className="flex items-center gap-3 py-12 justify-center">
            <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Fetching live data from FRED...</span>
          </div>
        )}

        {nationalError && (
          <p className="text-sm text-slate-400 italic py-8 text-center">
            Could not fetch national index data. Try refreshing.
          </p>
        )}

        {nationalChartData.length > 0 && (
          <LineChart
            dataPoints={nationalChartData}
            label=""
            color="#8551e6"
            height={220}
          />
        )}
      </div>

      {/* City Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">compare_arrows</span>
            City-wise Price Index Comparison
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Based on RBI Quarterly House Price Index (Base: 2010-11 = 100)
          </p>
        </div>

        {/* City selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {cityHPIData.map((city, i) => {
            const isSelected = selectedCities.includes(city.city);
            return (
              <button
                key={city.city}
                onClick={() => toggleCity(city.city)}
                className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                style={isSelected ? { backgroundColor: colors[i % colors.length] } : undefined}
              >
                {isSelected && <span className="size-1.5 rounded-full bg-white/60" />}
                {city.city}
              </button>
            );
          })}
        </div>

        <MultiCityChart cities={selectedCityData} />
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
        {sortedByGrowth.map((city, ci) => {
          const isSelected = selectedCities.includes(city.city);
          const latest = city.quarters[city.quarters.length - 1];
          const first = city.quarters[0];
          const quarterChange = ((latest.index - first.index) / first.index * 100);

          return (
            <div
              key={city.city}
              onClick={() => toggleCity(city.city)}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 transition-all cursor-pointer ${
                isSelected
                  ? "border-primary/40 shadow-md shadow-primary/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{city.city}</h4>
                  <p className="text-[10px] text-slate-400">{city.state}</p>
                </div>
                <ChangeIndicator value={city.yoyChange} />
              </div>

              {/* Mini sparkline */}
              <div className="mb-3">
                <LineChart
                  dataPoints={city.quarters.map((q) => ({ label: q.quarter, value: q.index }))}
                  label=""
                  color={colors[ci % colors.length]}
                  height={60}
                  sparkline
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-[10px] text-slate-400">Latest HPI</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatIndex(latest.index)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Avg Price/sq ft</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatRupees(city.avgPriceSqft)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">YoY Change</p>
                  <ChangeIndicator value={city.yoyChange} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">8-Quarter Change</p>
                  <ChangeIndicator value={quarterChange} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data source footer */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">info</span>
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>National Index:</strong> Residential Property Prices for India (QINN628BIS), sourced live from
            Bank for International Settlements via FRED (Federal Reserve Economic Data). Index base: 2010 = 100.
          </p>
          <p className="mt-1">
            <strong>City Indices:</strong> Based on RBI Quarterly House Price Index (HPI) for 10 major cities.
            Base: 2010-11 = 100. Avg price/sq ft from industry reports (approximate).
          </p>
        </div>
      </div>
    </div>
  );
}

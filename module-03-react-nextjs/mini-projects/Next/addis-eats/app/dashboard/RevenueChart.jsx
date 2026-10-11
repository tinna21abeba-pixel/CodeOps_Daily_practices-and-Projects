"use client";

import { useState } from "react";

export default function RevenueChart({ data = [] }) {
  const [activeItem, setActiveItem] = useState(null);

  const totalRevenue = data.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalOrders = data.reduce((sum, item) => sum + (Number(item.orderCount) || 0), 0);

  const maxVal = Math.max(...data.map((d) => Number(d.revenue) || 0), 1000);
  const yMax = Math.ceil(maxVal / 1000) * 1000 || 1000;
  const tickSteps = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const svgWidth = 600;
  const svgHeight = 280;
  const padLeft = 85;
  const padRight = 20;
  const padTop = 35;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const colWidth = data.length > 0 ? plotWidth / data.length : plotWidth;
  const barWidth = Math.min(50, colWidth * 0.6);

  return (
    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Revenue by Neighbourhood
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Unit: Ethiopian Birr (ETB) across delivery zones
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-zinc-400 block">Total Revenue</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">
            {Number(totalRevenue).toLocaleString()} ETB
          </span>
        </div>
      </div>

      <div
        style={{ width: "100%", height: "320px" }}
        className="w-full flex items-center justify-center overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[320px] select-none"
          role="img"
          aria-label="Bar chart showing revenue by neighbourhood in ETB starting at zero"
        >
          <defs>
            <pattern
              id="revenue-hatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#fbbf24" strokeWidth="1.5" />
            </pattern>
          </defs>

          {tickSteps.map((tickVal) => {
            const y = padTop + plotHeight - (tickVal / yMax) * plotHeight;
            return (
              <g key={tickVal}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="#3f3f46"
                  strokeDasharray={tickVal === 0 ? "0" : "3 3"}
                  strokeWidth={tickVal === 0 ? "1.5" : "1"}
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#a1a1aa"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {Math.round(tickVal).toLocaleString()} ETB
                </text>
              </g>
            );
          })}

          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={padTop + plotHeight}
            stroke="#52525b"
            strokeWidth="1.5"
          />

          {data.map((item, idx) => {
            const rev = Number(item.revenue) || 0;
            const barH = (rev / yMax) * plotHeight;
            const x = padLeft + idx * colWidth + (colWidth - barWidth) / 2;
            const y = padTop + plotHeight - barH;
            const isHovered = activeItem === item.area;

            return (
              <g
                key={item.area}
                onMouseEnter={() => setActiveItem(item.area)}
                onMouseLeave={() => setActiveItem(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(2, barH)}
                  fill={isHovered ? "#f59e0b" : "#d97706"}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  rx="3"
                />

                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(2, barH)}
                  fill="url(#revenue-hatch)"
                  opacity="0.25"
                  rx="3"
                />

                <text
                  x={x + barWidth / 2}
                  y={y - 7}
                  textAnchor="middle"
                  fill="#f4f4f5"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {rev.toLocaleString()} ETB
                </text>

                <text
                  x={x + barWidth / 2}
                  y={padTop + plotHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? "#fbbf24" : "#e4e4e7"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {item.area}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="caption-top text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Accessible Data Table: Revenue by Neighbourhood (ETB)
            </caption>

            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-300">
                <th scope="col" className="py-2 px-3 font-semibold text-left">
                  Neighbourhood
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Orders Count
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Revenue (ETB)
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Share of Revenue (%)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {data.map((row) => {
                const share =
                  totalRevenue > 0
                    ? (((Number(row.revenue) || 0) / totalRevenue) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr key={row.area} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2 px-3 font-medium text-white">{row.area}</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">
                      {row.orderCount || 0}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-400 font-semibold">
                      {Number(row.revenue || 0).toLocaleString()} ETB
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-400">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-zinc-700 font-bold bg-zinc-950 text-white">
                <th scope="row" className="py-2 px-3 text-left">
                  Total
                </th>
                <td className="py-2 px-3 text-right font-mono text-zinc-200">
                  {totalOrders}
                </td>
                <td className="py-2 px-3 text-right font-mono text-amber-400 font-extrabold">
                  {Number(totalRevenue).toLocaleString()} ETB
                </td>
                <td className="py-2 px-3 text-right font-mono text-zinc-200">
                  100.0%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}

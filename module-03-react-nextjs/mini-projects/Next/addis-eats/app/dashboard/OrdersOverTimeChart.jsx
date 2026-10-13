"use client";

import { useState } from "react";
import { etb } from "@/lib/format";

export default function OrdersOverTimeChart({
  data = [],
  range = "Oct 1 to Oct 7, 2026",
  unit = "Orders / Day",
}) {
  const [activeDate, setActiveDate] = useState(null);

  const totalOrders = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const totalRevenue = data.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);

  const maxVal = Math.max(...data.map((d) => Number(d.count) || 0), 4);
  const yMax = Math.ceil(maxVal) + (Math.ceil(maxVal) % 2 === 0 ? 0 : 1) || 6;
  const tickSteps = [];
  const stepCount = 4;
  for (let i = 0; i <= stepCount; i++) {
    tickSteps.push(Math.round((yMax / stepCount) * i));
  }

  const svgWidth = 600;
  const svgHeight = 280;
  const padLeft = 65;
  const padRight = 30;
  const padTop = 35;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const points = data.map((item, idx) => {
    const x =
      data.length > 1
        ? padLeft + (idx / (data.length - 1)) * plotWidth
        : padLeft + plotWidth / 2;
    const y = padTop + plotHeight - ((Number(item.count) || 0) / yMax) * plotHeight;
    return { ...item, x, y };
  });

  const linePath =
    points.length > 0
      ? points.reduce(
          (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
          ""
        )
      : "";

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padTop + plotHeight} L ${points[0].x} ${
          padTop + plotHeight
        } Z`
      : "";

  return (
    <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Orders Over Time — {range}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Unit: {unit} and daily delivery trends
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-zinc-400 block">Total Orders</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">
            {totalOrders} orders
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
          aria-label={`Line chart showing orders per day for ${range} starting at zero`}
        >
          <defs>
            <linearGradient id="order-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
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
                  {tickVal}
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

          {areaPath && <path d={areaPath} fill="url(#order-gradient)" />}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((pt) => {
            const isHovered = activeDate === pt.date;

            return (
              <g
                key={pt.date}
                onMouseEnter={() => setActiveDate(pt.date)}
                onMouseLeave={() => setActiveDate(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 5}
                  fill={isHovered ? "#fbbf24" : "#f59e0b"}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {pt.count}
                </text>

                <text
                  x={pt.x}
                  y={padTop + plotHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? "#fbbf24" : "#e4e4e7"}
                  fontSize="11"
                  fontWeight="600"
                >
                  {pt.label}
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
              Accessible Data Table: Orders Over Time — {range} ({unit})
            </caption>

            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-300">
                <th scope="col" className="py-2 px-3 font-semibold text-left">
                  Date
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Orders ({unit})
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Daily Revenue (ETB)
                </th>
                <th scope="col" className="py-2 px-3 font-semibold text-right">
                  Share of Total (%)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {data.map((row) => {
                const share =
                  totalOrders > 0
                    ? (((Number(row.count) || 0) / totalOrders) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr key={row.date} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2 px-3 font-medium text-white">{row.label}</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300 font-semibold">
                      {row.count}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-400">
                      {etb(row.revenue)}
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
                  Total ({range})
                </th>
                <td className="py-2 px-3 text-right font-mono text-amber-400 font-extrabold">
                  {totalOrders}
                </td>
                <td className="py-2 px-3 text-right font-mono text-amber-400 font-extrabold">
                  {etb(totalRevenue)}
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

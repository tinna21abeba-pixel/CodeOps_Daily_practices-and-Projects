"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OrdersPerDayChart({
  data = [],
  range = "Oct 1 to Oct 7, 2026",
  unit = "Orders / Day",
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && showTable) {
      setShowTable(false);
    }
  };

  const totalOrders = data.reduce((sum, item) => sum + (item.count || 0), 0);
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  return (
    <section className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2
            id="orders-per-day-title"
            className="text-base sm:text-lg font-bold text-stone-900"
          >
            Orders Per Day — {range} ({unit})
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daily order volume timeline and trend analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-xs text-stone-500 font-medium block">Total Volume</span>
            <span className="text-base font-extrabold text-blue-600 font-mono">
              {totalOrders} orders
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTable((prev) => !prev)}
            aria-expanded={showTable}
            aria-controls="orders-per-day-accessible-table"
            className="min-h-[44px] text-xs font-semibold px-4 py-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 inline-flex items-center justify-center"
            title="Toggle accessible tabular data"
          >
            {showTable ? "Hide Data Table" : "Show Data Table"}
          </button>
        </div>
      </div>

      <div
        style={{ width: "100%", height: 320 }}
        className="w-full"
        role="region"
        aria-label={`Line chart representing orders per day for ${range}`}
      >
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                width={40}
                tickFormatter={(v) => `${v}`}
              />

              <Tooltip
                formatter={(value) => [`${value} orders`, "Daily Orders"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-50/50 rounded-xl text-xs text-stone-400">
            Loading orders-per-day line chart...
          </div>
        )}
      </div>

      {showTable && (
        <div
          id="orders-per-day-accessible-table"
          className="mt-6 pt-5 border-t border-stone-200"
        >
          <div className="overflow-x-auto">
            <table
              className="w-full text-left text-xs sm:text-sm border-collapse"
              aria-labelledby="orders-per-day-title"
            >
              <caption className="caption-top text-left text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Accessible Data Table: Orders Per Day — {range} ({unit})
              </caption>

              <thead>
                <tr className="border-b border-stone-200 text-stone-600 bg-stone-50/80">
                  <th scope="col" className="py-2.5 px-3 font-semibold text-left">
                    Date / Day
                  </th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                    Orders ({unit})
                  </th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                    Daily Revenue (ETB)
                  </th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-right">
                    Share of Total (%)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {data.map((row) => {
                  const share = totalOrders > 0
                    ? ((row.count / totalOrders) * 100).toFixed(1)
                    : "0.0";

                  return (
                    <tr
                      key={row.date || row.label}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      <td className="py-2 px-3 font-medium text-stone-800">
                        {row.label}
                        <span className="text-stone-400 text-xs ml-1.5 hidden sm:inline">
                          ({row.date})
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-stone-800 font-semibold">
                        {row.count}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-stone-700">
                        {Number(row.revenue || 0).toLocaleString()} ETB
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-stone-500">
                        {share}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-t-2 border-stone-300 font-bold bg-stone-50 text-stone-900">
                  <th scope="row" className="py-2.5 px-3 text-left">
                    Total ({range})
                  </th>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700">
                    {totalOrders}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-orange-600">
                    {Number(totalRevenue).toLocaleString()} ETB
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                    100.0%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            This table provides a complete semantic accessible alternative to the SVG line chart.
          </p>
        </div>
      )}
    </section>
  );
}

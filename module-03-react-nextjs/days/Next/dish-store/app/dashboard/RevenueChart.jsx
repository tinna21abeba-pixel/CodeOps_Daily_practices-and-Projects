"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Exercise 2:
 * Build the revenue bar chart with a fixed-height container and ETB tick formatting.
 */
export default function RevenueChart({ data }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format ETB currency ticks and values
  const formatETB = (val) => `${Number(val).toLocaleString()} ETB`;

  const totalRevenue = data?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;

  return (
    <section className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Revenue by Neighbourhood
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Total sales aggregated across delivery zones in Addis Ababa
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-stone-500 font-medium block">Total Revenue</span>
          <span className="text-base font-extrabold text-orange-600 font-mono">
            {formatETB(totalRevenue)}
          </span>
        </div>
      </div>

      {/* Fixed-height container (height: 320px) to prevent layout shifts */}
      <div style={{ width: "100%", height: 320 }} className="w-full">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="area"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              />

              {/* Requirement 2: ETB tick formatting on Y-Axis */}
              <YAxis
                tickFormatter={formatETB}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                width={80}
              />

              <Tooltip
                formatter={(value) => [formatETB(value), "Revenue"]}
                labelFormatter={(label) => `Zone: ${label}`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#ea580c"
                radius={[6, 6, 0, 0]}
                maxBarSize={55}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-50/50 rounded-xl text-xs text-stone-400">
            Loading revenue bar chart...
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>Unit: Ethiopian Birr (ETB)</span>
        <span>{data?.length || 0} Neighbourhoods tracked</span>
      </div>
    </section>
  );
}

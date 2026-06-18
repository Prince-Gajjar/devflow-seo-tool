"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  layout?: "horizontal" | "vertical";
  color?: string;
}

export function BarChart({ data, layout = "vertical", color = "#a3e635" }: BarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center text-xs text-muted-foreground bg-card-border/10 rounded animate-pulse">
        Loading Chart...
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full mt-4 text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5
          }}
        >
          {layout === "horizontal" ? (
            <>
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid #1c1c1f",
              borderRadius: "4px",
              color: "#fafafa"
            }}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Bar 
            dataKey="value" 
            radius={layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? "#84cc16" : color} // Highlights top bar with accent color
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default BarChart;

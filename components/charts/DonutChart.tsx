"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface DonutChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

export function DonutChart({ 
  data, 
  colors = ["#a3e635", "#84cc16", "#65a30d", "#27272a"] // lime spectrum + zinc dark
}: DonutChartProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#09090b",
              border: "1px solid #1c1c1f",
              borderRadius: "4px",
              color: "#fafafa"
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export default DonutChart;

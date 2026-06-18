"use client";

import React from "react";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function SparklineChart({
  data,
  width = 100,
  height = 30,
  color = "#a3e635" // default primary lime
}: SparklineChartProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      // Invert Y coordinate because SVG 0,0 is top-left
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Glow Effect under the line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Draw small dots on start/end for visual polish */}
      {data.length > 0 && (
        <>
          <circle
            cx={0}
            cy={height - ((data[0] - min) / range) * (height - 4) - 2}
            r="2"
            fill={color}
          />
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
            r="2"
            fill={color}
          />
        </>
      )}
    </svg>
  );
}
export default SparklineChart;

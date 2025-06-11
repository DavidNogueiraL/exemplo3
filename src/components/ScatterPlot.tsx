import React from 'react';

interface ScatterPlotProps {
  data: { x: number; y: number; label?: string }[];
  title: string;
  xLabel: string;
  yLabel: string;
  threshold?: number;
  height?: number;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  title,
  xLabel,
  yLabel,
  threshold,
  height = 300
}) => {
  const maxX = Math.max(...data.map(d => d.x));
  const maxY = Math.max(...data.map(d => d.y));
  const minX = Math.min(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));

  const getX = (value: number) => ((value - minX) / (maxX - minX)) * 85 + 10;
  const getY = (value: number) => 90 - ((value - minY) / (maxY - minY)) * 75;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Threshold line */}
          {threshold && (
            <line
              x1="10"
              y1={getY(threshold)}
              x2="95"
              y2={getY(threshold)}
              stroke="#EF4444"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          )}
          
          {/* Data points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getX(point.x)}
              cy={getY(point.y)}
              r="1.5"
              fill={threshold && point.y > threshold ? "#EF4444" : "#3B82F6"}
              className="hover:r-2 cursor-pointer opacity-70 hover:opacity-100"
            />
          ))}
          
          {/* Axes */}
          <line x1="10" y1="90" x2="95" y2="90" stroke="#374151" strokeWidth="0.5" />
          <line x1="10" y1="10" x2="10" y2="90" stroke="#374151" strokeWidth="0.5" />
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
          {xLabel}
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600">
          {yLabel}
        </div>
      </div>
    </div>
  );
};
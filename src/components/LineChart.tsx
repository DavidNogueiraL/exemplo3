import React from 'react';

interface LineChartProps {
  data: { label: string; value: number; date?: string }[];
  title: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getY = (value: number) => {
    const percentage = range === 0 ? 50 : ((value - minValue) / range) * 80 + 10;
    return 100 - percentage;
  };

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#gradient)"
          />
          
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="0.5"
          />
          
          {data.map((point, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 100}
              cy={getY(point.value)}
              r="1"
              fill="#3B82F6"
              className="hover:r-2 cursor-pointer"
            />
          ))}
        </svg>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index} className="text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
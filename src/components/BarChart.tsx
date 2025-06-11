import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; category?: string }[];
  title: string;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  horizontal = false,
  stacked = false
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className={`${horizontal ? 'space-y-3' : 'flex items-end space-x-2'}`} style={{ height }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = colors[index % colors.length];
          
          if (horizontal) {
            return (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 text-right mr-3">
                  {item.label}
                </div>
                <div className="flex-1 relative">
                  <div 
                    className="h-8 rounded"
                    style={{ 
                      backgroundColor: color,
                      width: `${percentage}%`,
                      minWidth: '20px'
                    }}
                  />
                  <span className="absolute right-2 top-1 text-xs font-medium text-white">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t"
                style={{ 
                  backgroundColor: color,
                  height: `${percentage}%`,
                  minHeight: '20px'
                }}
              />
              <div className="mt-2 text-xs text-gray-600 text-center">
                <div className="font-medium">{item.value.toLocaleString()}</div>
                <div>{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
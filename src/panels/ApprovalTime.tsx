import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { BarChart } from '../components/BarChart';
import { mockIncidents } from '../data/mockData';

export const ApprovalTime: React.FC = () => {
  const approvalData = useMemo(() => {
    // Group by approval level
    const approvalLevels = mockIncidents.reduce((acc, incident) => {
      if (!acc[incident.approvalLevel]) {
        acc[incident.approvalLevel] = { times: [], protectionTypes: {} };
      }
      acc[incident.approvalLevel].times.push(incident.approvalTime);
      
      if (!acc[incident.approvalLevel].protectionTypes[incident.protectionType]) {
        acc[incident.approvalLevel].protectionTypes[incident.protectionType] = [];
      }
      acc[incident.approvalLevel].protectionTypes[incident.protectionType].push(incident.approvalTime);
      
      return acc;
    }, {} as Record<string, { times: number[]; protectionTypes: Record<string, number[]> }>);

    // Calculate averages and standard deviations
    const approvalStats = Object.entries(approvalLevels).map(([level, data]) => {
      const times = data.times;
      const average = times.reduce((sum, time) => sum + time, 0) / times.length;
      const variance = times.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / times.length;
      const stdDev = Math.sqrt(variance);
      
      return {
        level,
        average: Math.round(average * 10) / 10,
        stdDev: Math.round(stdDev * 10) / 10,
        min: Math.min(...times),
        max: Math.max(...times),
        count: times.length
      };
    });

    const levelChart = approvalStats.map(stat => ({
      label: stat.level,
      value: stat.average
    }));

    // By protection type for each approval level
    const protectionTypeStats = {};
    Object.entries(approvalLevels).forEach(([level, data]) => {
      protectionTypeStats[level] = Object.entries(data.protectionTypes).map(([type, times]) => ({
        label: type,
        value: Math.round((times.reduce((sum, time) => sum + time, 0) / times.length) * 10) / 10
      }));
    });

    const overallAverage = approvalStats.reduce((sum, stat) => sum + stat.average, 0) / approvalStats.length;

    return {
      approvalStats,
      levelChart,
      protectionTypeStats,
      overallAverage
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Overall Avg Approval Time"
          value={Math.round(approvalData.overallAverage)}
          suffix="hrs"
          change={-8}
          trend="down"
        />
        {approvalData.approvalStats.map(stat => (
          <KPICard
            key={stat.level}
            title={`${stat.level} Avg`}
            value={stat.average}
            suffix="hrs"
            change={Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 10)}
            trend={Math.random() > 0.5 ? 'up' : 'down'}
          />
        ))}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={approvalData.levelChart}
          title="Average Approval Time by Level"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Statistics</h3>
          <div className="space-y-4">
            {approvalData.approvalStats.map(stat => (
              <div key={stat.level} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{stat.level}</span>
                  <span className="text-sm text-gray-500">{stat.count} incidents</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg:</span>
                    <span className="font-medium ml-1">{stat.average}h</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min:</span>
                    <span className="font-medium ml-1">{Math.round(stat.min)}h</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max:</span>
                    <span className="font-medium ml-1">{Math.round(stat.max)}h</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Std Dev:</span>
                  <span className="font-medium ml-1 text-sm">{stat.stdDev}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protection Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(approvalData.protectionTypeStats).map(([level, data]) => (
          <BarChart
            key={level}
            data={data as any}
            title={`${level} - By Protection Type`}
            horizontal
          />
        ))}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {approvalData.approvalStats.sort((a, b) => a.average - b.average)[0]?.level}
            </div>
            <div className="text-sm text-gray-600">Fastest Approval Level</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: {approvalData.approvalStats.sort((a, b) => a.average - b.average)[0]?.average}h
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {approvalData.approvalStats.sort((a, b) => b.average - a.average)[0]?.level}
            </div>
            <div className="text-sm text-gray-600">Slowest Approval Level</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: {approvalData.approvalStats.sort((a, b) => b.average - a.average)[0]?.average}h
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {Math.round(approvalData.overallAverage)}h
            </div>
            <div className="text-sm text-gray-600">Overall Average</div>
            <div className="text-xs text-gray-500 mt-1">
              Across all levels
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
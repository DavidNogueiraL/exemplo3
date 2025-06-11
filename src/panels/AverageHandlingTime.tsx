import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { mockIncidents } from '../data/mockData';

export const AverageHandlingTime: React.FC = () => {
  const handlingTimeData = useMemo(() => {
    const closedIncidents = mockIncidents.filter(incident => incident.closeDate);
    const reopenedIncidents = mockIncidents.filter(incident => incident.reopenDate && incident.finalCloseDate);
    
    // Calculate average handling times
    const calculateDays = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    };

    const openToCloseTime = closedIncidents.map(incident => 
      calculateDays(incident.openDate, incident.closeDate!)
    );
    
    const reopenToCloseTime = reopenedIncidents.map(incident => 
      calculateDays(incident.reopenDate!, incident.finalCloseDate!)
    );

    const avgOpenToClose = openToCloseTime.reduce((sum, time) => sum + time, 0) / openToCloseTime.length || 0;
    const avgReopenToClose = reopenToCloseTime.reduce((sum, time) => sum + time, 0) / reopenToCloseTime.length || 0;

    // Monthly averages
    const monthlyAverages = closedIncidents.reduce((acc, incident) => {
      const date = new Date(incident.closeDate!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const days = calculateDays(incident.openDate, incident.closeDate!);
      
      if (!acc[key]) acc[key] = { total: 0, count: 0 };
      acc[key].total += days;
      acc[key].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const monthlyChart = Object.entries(monthlyAverages).map(([month, data]) => ({
      label: month,
      value: Math.round(data.total / data.count)
    }));

    // By protection type
    const protectionAverages = closedIncidents.reduce((acc, incident) => {
      const days = calculateDays(incident.openDate, incident.closeDate!);
      
      if (!acc[incident.protectionType]) acc[incident.protectionType] = { total: 0, count: 0 };
      acc[incident.protectionType].total += days;
      acc[incident.protectionType].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const protectionChart = Object.entries(protectionAverages).map(([type, data]) => ({
      label: type,
      value: Math.round(data.total / data.count)
    }));

    // By analyst
    const analystAverages = closedIncidents.reduce((acc, incident) => {
      const days = calculateDays(incident.openDate, incident.closeDate!);
      
      if (!acc[incident.analyst]) acc[incident.analyst] = { total: 0, count: 0 };
      acc[incident.analyst].total += days;
      acc[incident.analyst].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const analystChart = Object.entries(analystAverages).map(([analyst, data]) => ({
      label: analyst,
      value: Math.round(data.total / data.count)
    }));

    return {
      avgOpenToClose,
      avgReopenToClose,
      monthlyChart,
      protectionChart,
      analystChart
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KPICard
          title="Avg Time: Open to Close"
          value={Math.round(handlingTimeData.avgOpenToClose)}
          suffix="days"
          change={-5}
          trend="down"
        />
        <KPICard
          title="Avg Time: Reopen to Close"
          value={Math.round(handlingTimeData.avgReopenToClose)}
          suffix="days"
          change={15}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={handlingTimeData.monthlyChart}
          title="Monthly Average Handling Time"
        />
        <BarChart
          data={handlingTimeData.protectionChart}
          title="Avg Handling Time by Protection Type"
          horizontal
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={handlingTimeData.analystChart}
          title="Avg Handling Time by Analyst"
          horizontal
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600">Best Performing Analyst</div>
              <div className="text-lg font-semibold">
                {handlingTimeData.analystChart.sort((a, b) => a.value - b.value)[0]?.label}
              </div>
              <div className="text-sm text-green-600">
                {handlingTimeData.analystChart.sort((a, b) => a.value - b.value)[0]?.value} days avg
              </div>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <div className="text-sm text-gray-600">Needs Improvement</div>
              <div className="text-lg font-semibold">
                {handlingTimeData.analystChart.sort((a, b) => b.value - a.value)[0]?.label}
              </div>
              <div className="text-sm text-red-600">
                {handlingTimeData.analystChart.sort((a, b) => b.value - a.value)[0]?.value} days avg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
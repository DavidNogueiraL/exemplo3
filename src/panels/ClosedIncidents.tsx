import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { PieChart } from '../components/PieChart';
import { LineChart } from '../components/LineChart';
import { BarChart } from '../components/BarChart';
import { mockIncidents } from '../data/mockData';

export const ClosedIncidents: React.FC = () => {
  const closedIncidentsData = useMemo(() => {
    const closedIncidents = mockIncidents.filter(incident => incident.status === 'Closed');
    const totalClosed = closedIncidents.length;
    
    // By analyst
    const analystData = closedIncidents.reduce((acc, incident) => {
      acc[incident.analyst] = (acc[incident.analyst] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const analystChart = Object.entries(analystData).map(([analyst, count]) => ({
      label: analyst,
      value: count
    }));

    // By protection type
    const protectionData = closedIncidents.reduce((acc, incident) => {
      acc[incident.protectionType] = (acc[incident.protectionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const protectionChart = Object.entries(protectionData).map(([type, count]) => ({
      label: type,
      value: count
    }));

    // Monthly closings
    const monthlyData = closedIncidents.reduce((acc, incident) => {
      const date = new Date(incident.closeDate!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChart = Object.entries(monthlyData).map(([month, count]) => ({
      label: month,
      value: count
    }));

    // Monthly closings by analyst
    const monthlyByAnalyst = closedIncidents.reduce((acc, incident) => {
      const date = new Date(incident.closeDate!);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[month]) acc[month] = {};
      acc[month][incident.analyst] = (acc[month][incident.analyst] || 0) + 1;
      
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return {
      totalClosed,
      analystChart,
      protectionChart,
      monthlyChart,
      monthlyByAnalyst
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Closed Incidents"
          value={closedIncidentsData.totalClosed}
          change={22}
          trend="up"
        />
        <KPICard
          title="Avg per Analyst"
          value={Math.round(closedIncidentsData.totalClosed / closedIncidentsData.analystChart.length)}
          change={5}
          trend="up"
        />
        <KPICard
          title="Top Performer"
          value={closedIncidentsData.analystChart.sort((a, b) => b.value - a.value)[0]?.label.split(' ')[0] || 'N/A'}
          change={0}
          trend="stable"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={closedIncidentsData.analystChart}
          title="Closed Incidents by Analyst"
        />
        <PieChart
          data={closedIncidentsData.protectionChart}
          title="Closed Incidents by Protection Type"
          donut
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={closedIncidentsData.monthlyChart}
          title="Monthly Closing Trend"
        />
        <BarChart
          data={closedIncidentsData.analystChart}
          title="Closings by Analyst"
          horizontal
        />
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            {closedIncidentsData.analystChart
              .sort((a, b) => b.value - a.value)
              .map((analyst, index) => (
                <div key={analyst.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-orange-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{analyst.label}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analyst.value} incidents ({((analyst.value / closedIncidentsData.totalClosed) * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-600">Most Active Protection Type</div>
              <div className="text-lg font-semibold">
                {closedIncidentsData.protectionChart.sort((a, b) => b.value - a.value)[0]?.label}
              </div>
              <div className="text-sm text-blue-600">
                {closedIncidentsData.protectionChart.sort((a, b) => b.value - a.value)[0]?.value} incidents
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600">Peak Closing Month</div>
              <div className="text-lg font-semibold">
                {closedIncidentsData.monthlyChart.sort((a, b) => b.value - a.value)[0]?.label}
              </div>
              <div className="text-sm text-green-600">
                {closedIncidentsData.monthlyChart.sort((a, b) => b.value - a.value)[0]?.value} closings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
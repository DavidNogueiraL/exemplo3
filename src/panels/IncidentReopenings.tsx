import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { BarChart } from '../components/BarChart';
import { DataTable } from '../components/DataTable';
import { mockIncidents } from '../data/mockData';

export const IncidentReopenings: React.FC = () => {
  const reopeningsData = useMemo(() => {
    const reopenedIncidents = mockIncidents.filter(incident => incident.reopenDate);
    
    const totalReopenings = reopenedIncidents.length;
    const totalPayments = reopenedIncidents.reduce((sum, incident) => sum + incident.paidAmount, 0);
    const avgPaymentPerReopening = totalPayments / totalReopenings || 0;
    
    // Monthly reopenings
    const monthlyData = reopenedIncidents.reduce((acc, incident) => {
      const date = new Date(incident.reopenDate!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChart = Object.entries(monthlyData).map(([month, count]) => ({
      label: month,
      value: count
    }));

    // By protection type
    const protectionTypeData = reopenedIncidents.reduce((acc, incident) => {
      acc[incident.protectionType] = (acc[incident.protectionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const protectionChart = Object.entries(protectionTypeData).map(([type, count]) => ({
      label: type,
      value: count
    }));

    // Payments per incident
    const paymentsData = reopenedIncidents.reduce((acc, incident) => {
      acc[incident.paymentsCount] = (acc[incident.paymentsCount] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const paymentsChart = Object.entries(paymentsData).map(([payments, count]) => ({
      label: `${payments} payments`,
      value: count
    }));

    return {
      totalReopenings,
      avgPaymentPerReopening,
      monthlyChart,
      protectionChart,
      paymentsChart,
      reopenedIncidents
    };
  }, []);

  const columns = [
    { key: 'id', label: 'Incident ID', sortable: true },
    { key: 'institutionName', label: 'Institution', sortable: true },
    { key: 'protectionType', label: 'Protection Type', sortable: true },
    { key: 'analyst', label: 'Analyst', sortable: true },
    { 
      key: 'paidAmount', 
      label: 'Paid Amount', 
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'paymentsCount', label: 'Payments', sortable: true },
    { key: 'reopenDate', label: 'Reopen Date', sortable: true }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KPICard
          title="Total Reopenings"
          value={reopeningsData.totalReopenings}
          change={-12}
          trend="down"
        />
        <KPICard
          title="Avg Payment per Reopening"
          value={`$${reopeningsData.avgPaymentPerReopening.toLocaleString()}`}
          change={8}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={reopeningsData.monthlyChart}
          title="Monthly Reopenings Trend"
        />
        <BarChart
          data={reopeningsData.protectionChart}
          title="Reopenings by Protection Type"
          horizontal
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={reopeningsData.paymentsChart}
          title="Number of Payments per Incident"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Most affected protection type:</span>
              <span className="font-medium">{reopeningsData.protectionChart[0]?.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Peak reopening month:</span>
              <span className="font-medium">{reopeningsData.monthlyChart.sort((a, b) => b.value - a.value)[0]?.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Total payment amount:</span>
              <span className="font-medium">${(reopeningsData.avgPaymentPerReopening * reopeningsData.totalReopenings).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={reopeningsData.reopenedIncidents}
        columns={columns}
        title="Reopened Incidents Details"
        searchable
      />
    </div>
  );
};
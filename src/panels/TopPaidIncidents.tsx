import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { DataTable } from '../components/DataTable';
import { BarChart } from '../components/BarChart';
import { mockIncidents } from '../data/mockData';

export const TopPaidIncidents: React.FC = () => {
  const topPaidData = useMemo(() => {
    const sortedIncidents = [...mockIncidents]
      .sort((a, b) => b.paidAmount - a.paidAmount)
      .slice(0, 10);

    const totalPaid = mockIncidents.reduce((sum, incident) => sum + incident.paidAmount, 0);
    const averagePaid = totalPaid / mockIncidents.length;
    const highestPaid = sortedIncidents[0];

    // Top paid by protection type
    const protectionTotals = mockIncidents.reduce((acc, incident) => {
      acc[incident.protectionType] = (acc[incident.protectionType] || 0) + incident.paidAmount;
      return acc;
    }, {} as Record<string, number>);

    const protectionChart = Object.entries(protectionTotals).map(([type, total]) => ({
      label: type,
      value: Math.round(total)
    }));

    // Top paid by institution
    const institutionTotals = mockIncidents.reduce((acc, incident) => {
      acc[incident.institutionName] = (acc[incident.institutionName] || 0) + incident.paidAmount;
      return acc;
    }, {} as Record<string, number>);

    const topInstitutions = Object.entries(institutionTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([institution, total]) => ({
        label: institution,
        value: Math.round(total)
      }));

    return {
      sortedIncidents,
      totalPaid,
      averagePaid,
      highestPaid,
      protectionChart,
      topInstitutions
    };
  }, []);

  const columns = [
    { 
      key: 'rank', 
      label: 'Rank',
      render: (value: any, row: any, index: number) => (
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
          }`}>
            {index + 1}
          </div>
        </div>
      )
    },
    { key: 'id', label: 'Incident ID', sortable: true },
    { 
      key: 'paidAmount', 
      label: 'Paid Amount', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <span className="font-semibold text-green-600">${value.toLocaleString()}</span>
          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${(value / topPaidData.highestPaid.paidAmount) * 100}%` }}
            />
          </div>
        </div>
      )
    },
    { key: 'institutionName', label: 'Institution', sortable: true },
    { key: 'protectionType', label: 'Protection Type', sortable: true },
    { key: 'incidentType', label: 'Incident Type', sortable: true },
    { key: 'participantName', label: 'Participant', sortable: true },
    { key: 'analyst', label: 'Analyst', sortable: true }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Highest Single Payment"
          value={`$${topPaidData.highestPaid.paidAmount.toLocaleString()}`}
          change={-3}
          trend="down"
        />
        <KPICard
          title="Total Paid (All Incidents)"
          value={`$${topPaidData.totalPaid.toLocaleString()}`}
          change={18}
          trend="up"
        />
        <KPICard
          title="Average Payment"
          value={`$${Math.round(topPaidData.averagePaid).toLocaleString()}`}
          change={7}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={topPaidData.protectionChart}
          title="Total Paid by Protection Type"
          horizontal
        />
        <BarChart
          data={topPaidData.topInstitutions}
          title="Top Institutions by Total Paid"
          horizontal
        />
      </div>

      {/* Highlight Card */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">👑</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Highest Paid Incident</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>{topPaidData.highestPaid.id}</strong> - {topPaidData.highestPaid.institutionName}
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              ${topPaidData.highestPaid.paidAmount.toLocaleString()}
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-600">Protection Type</div>
            <div className="font-medium">{topPaidData.highestPaid.protectionType}</div>
            <div className="text-sm text-gray-600 mt-1">Analyst</div>
            <div className="font-medium">{topPaidData.highestPaid.analyst}</div>
          </div>
        </div>
      </div>

      {/* Top 10 Table */}
      <DataTable
        data={topPaidData.sortedIncidents}
        columns={columns}
        title="Top 10 Highest Paid Incidents"
        pageSize={10}
        searchable
      />
    </div>
  );
};
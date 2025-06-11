import React, { useMemo } from 'react';
import { KPICard } from '../components/KPICard';
import { ScatterPlot } from '../components/ScatterPlot';
import { DataTable } from '../components/DataTable';
import { BarChart } from '../components/BarChart';
import { mockIncidents } from '../data/mockData';

export const SalvagePayment: React.FC = () => {
  const salvageData = useMemo(() => {
    // Filter for total loss cases with vehicles and equipment
    const totalLossIncidents = mockIncidents.filter(incident => 
      incident.isTotalLoss && 
      ['Vehicles', 'Equipment'].includes(incident.protectionType)
    );

    // Calculate days from PT payment to salvage receipt
    const salvageAnalysis = totalLossIncidents.map(incident => {
      if (!incident.salvageReceiptDate) {
        return {
          ...incident,
          daysToReceipt: null,
          isDelayed: true,
          hasReceipt: false
        };
      }

      const ptDate = new Date(incident.closeDate || incident.openDate);
      const salvageDate = new Date(incident.salvageReceiptDate);
      const daysToReceipt = Math.ceil((salvageDate.getTime() - ptDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...incident,
        daysToReceipt,
        isDelayed: daysToReceipt > 30,
        hasReceipt: true
      };
    });

    const withReceipts = salvageAnalysis.filter(item => item.hasReceipt);
    const delayedCases = salvageAnalysis.filter(item => item.isDelayed);
    const averageDays = withReceipts.reduce((sum, item) => sum + (item.daysToReceipt || 0), 0) / withReceipts.length || 0;

    // Scatter plot data
    const scatterData = withReceipts.map((item, index) => ({
      x: index + 1,
      y: item.daysToReceipt || 0,
      label: item.id
    }));

    // By protection type
    const protectionTypeData = withReceipts.reduce((acc, item) => {
      if (!acc[item.protectionType]) {
        acc[item.protectionType] = { total: 0, count: 0, delayed: 0 };
      }
      acc[item.protectionType].total += item.daysToReceipt || 0;
      acc[item.protectionType].count += 1;
      if (item.isDelayed) acc[item.protectionType].delayed += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number; delayed: number }>);

    const protectionChart = Object.entries(protectionTypeData).map(([type, data]) => ({
      label: type,
      value: Math.round(data.total / data.count)
    }));

    return {
      totalCases: totalLossIncidents.length,
      withReceipts: withReceipts.length,
      delayedCases: delayedCases.length,
      averageDays,
      scatterData,
      protectionChart,
      salvageAnalysis: salvageAnalysis.slice(0, 20) // Show top 20 for table
    };
  }, []);

  const columns = [
    { key: 'id', label: 'Incident ID', sortable: true },
    { key: 'protectionType', label: 'Protection Type', sortable: true },
    { key: 'institutionName', label: 'Institution', sortable: true },
    { 
      key: 'paidAmount', 
      label: 'PT Payment', 
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'daysToReceipt', 
      label: 'Days to Receipt', 
      sortable: true,
      render: (value: number | null, row: any) => {
        if (value === null) {
          return <span className="text-red-600 font-medium">Pending</span>;
        }
        return (
          <span className={value > 30 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
            {value} days
          </span>
        );
      }
    },
    { 
      key: 'salvageReceiptDate', 
      label: 'Receipt Date', 
      sortable: true,
      render: (value: string | undefined) => value || 'Not received'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any, row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          !row.hasReceipt 
            ? 'bg-red-100 text-red-800' 
            : row.isDelayed 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
        }`}>
          {!row.hasReceipt ? 'No Receipt' : row.isDelayed ? 'Delayed' : 'On Time'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total TL Cases"
          value={salvageData.totalCases}
          change={5}
          trend="up"
        />
        <KPICard
          title="Cases with Receipts"
          value={salvageData.withReceipts}
          change={-2}
          trend="down"
        />
        <KPICard
          title="Delayed Cases (>30 days)"
          value={salvageData.delayedCases}
          change={18}
          trend="up"
        />
        <KPICard
          title="Average Days to Receipt"
          value={Math.round(salvageData.averageDays)}
          suffix="days"
          change={-12}
          trend="down"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScatterPlot
          data={salvageData.scatterData}
          title="Days to Salvage Receipt (with 30-day threshold)"
          xLabel="Case Number"
          yLabel="Days"
          threshold={30}
        />
        <BarChart
          data={salvageData.protectionChart}
          title="Average Days by Protection Type"
          horizontal
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Critical Delays</h3>
              <p className="text-3xl font-bold text-red-600">{salvageData.delayedCases}</p>
              <p className="text-sm text-red-600">Cases over 30 days</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">On-Time Receipts</h3>
              <p className="text-3xl font-bold text-green-600">{salvageData.withReceipts - salvageData.delayedCases}</p>
              <p className="text-sm text-green-600">Within 30 days</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Receipts</h3>
              <p className="text-3xl font-bold text-gray-600">{salvageData.totalCases - salvageData.withReceipts}</p>
              <p className="text-sm text-gray-600">No receipt yet</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={salvageData.salvageAnalysis}
        columns={columns}
        title="Salvage Payment Receipt Status"
        searchable
      />
    </div>
  );
};
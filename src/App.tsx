import React, { useState } from 'react';
import { BarChart3, Clock, CheckCircle, DollarSign, Timer, Package, Filter } from 'lucide-react';
import { IncidentReopenings } from './panels/IncidentReopenings';
import { AverageHandlingTime } from './panels/AverageHandlingTime';
import { ClosedIncidents } from './panels/ClosedIncidents';
import { TopPaidIncidents } from './panels/TopPaidIncidents';
import { ApprovalTime } from './panels/ApprovalTime';
import { SalvagePayment } from './panels/SalvagePayment';

type TabType = 'reopenings' | 'handling-time' | 'closed' | 'top-paid' | 'approval' | 'salvage';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  {
    id: 'reopenings',
    label: 'Incident Reopenings',
    icon: BarChart3,
    component: IncidentReopenings
  },
  {
    id: 'handling-time',
    label: 'Average Handling Time',
    icon: Clock,
    component: AverageHandlingTime
  },
  {
    id: 'closed',
    label: 'Closed Incidents',
    icon: CheckCircle,
    component: ClosedIncidents
  },
  {
    id: 'top-paid',
    label: 'Top Paid Incidents',
    icon: DollarSign,
    component: TopPaidIncidents
  },
  {
    id: 'approval',
    label: 'Approval Time',
    icon: Timer,
    component: ApprovalTime
  },
  {
    id: 'salvage',
    label: 'Salvage Payment',
    icon: Package,
    component: SalvagePayment
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reopenings');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || IncidentReopenings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Insurance Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          <p className="text-gray-600 mt-1">
            Strategic monitoring and analysis for insurance incident management
          </p>
        </div>
        
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;
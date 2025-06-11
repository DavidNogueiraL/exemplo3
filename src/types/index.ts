export interface Incident {
  id: string;
  institutionName: string;
  protectionType: 'Equipment' | 'Vehicles' | 'Properties';
  incidentType: string;
  participantName: string;
  analyst: string;
  openDate: string;
  closeDate?: string;
  reopenDate?: string;
  finalCloseDate?: string;
  paidAmount: number;
  paymentsCount: number;
  approvalLevel: 'Analyst' | 'Reviewer' | 'Manager';
  approvalTime: number; // in hours
  salvageReceiptDate?: string;
  isTotalLoss: boolean;
  status: 'Open' | 'Closed' | 'Reopened';
}

export interface KPIData {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  label: string;
}

export interface ChartData {
  label: string;
  value: number;
  category?: string;
  date?: string;
}
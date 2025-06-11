import { Incident } from '../types';

const analysts = ['John Smith', 'Maria Garcia', 'David Chen', 'Sarah Wilson', 'Mike Johnson'];
const protectionTypes = ['Equipment', 'Vehicles', 'Properties'] as const;
const institutions = ['ABC Insurance Co.', 'Safe Guard Ltd.', 'Premier Protection', 'United Coverage', 'Global Assurance'];
const incidentTypes = ['Accident', 'Theft', 'Natural Disaster', 'Equipment Failure', 'Fire Damage'];
const participantNames = ['Company A', 'Company B', 'Company C', 'Individual D', 'Corporation E'];

// Generate mock incidents data
export const mockIncidents: Incident[] = Array.from({ length: 500 }, (_, i) => {
  const openDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const hasReopening = Math.random() < 0.3; // 30% chance of reopening
  const isClosed = Math.random() < 0.7; // 70% chance of being closed
  
  let closeDate: Date | undefined;
  let reopenDate: Date | undefined;
  let finalCloseDate: Date | undefined;
  let status: 'Open' | 'Closed' | 'Reopened' = 'Open';

  if (isClosed) {
    closeDate = new Date(openDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Close within 90 days
    status = 'Closed';
    
    if (hasReopening) {
      reopenDate = new Date(closeDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Reopen within 30 days
      finalCloseDate = new Date(reopenDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // Final close within 60 days
      status = Math.random() < 0.8 ? 'Closed' : 'Reopened';
    }
  }

  const protectionType = protectionTypes[Math.floor(Math.random() * protectionTypes.length)];
  const isTotalLoss = Math.random() < 0.2; // 20% are total loss
  const paidAmount = Math.random() * 100000 + 5000; // Between $5k-$105k

  return {
    id: `INC-${String(i + 1).padStart(4, '0')}`,
    institutionName: institutions[Math.floor(Math.random() * institutions.length)],
    protectionType,
    incidentType: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
    participantName: participantNames[Math.floor(Math.random() * participantNames.length)],
    analyst: analysts[Math.floor(Math.random() * analysts.length)],
    openDate: openDate.toISOString().split('T')[0],
    closeDate: closeDate?.toISOString().split('T')[0],
    reopenDate: reopenDate?.toISOString().split('T')[0],
    finalCloseDate: finalCloseDate?.toISOString().split('T')[0],
    paidAmount,
    paymentsCount: Math.floor(Math.random() * 5) + 1,
    approvalLevel: ['Analyst', 'Reviewer', 'Manager'][Math.floor(Math.random() * 3)] as any,
    approvalTime: Math.random() * 120 + 2, // 2-122 hours
    salvageReceiptDate: isTotalLoss && Math.random() < 0.8 ? 
      new Date(openDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
      undefined,
    isTotalLoss,
    status
  };
});
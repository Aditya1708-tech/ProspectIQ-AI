import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Clock, User, TrendingUp, Check, AlertCircle, Calendar, 
  DollarSign, Award, ShieldCheck, Layers, Landmark, Activity, 
  FileText, Loader2, Sparkles, AlertTriangle
} from 'lucide-react';
import { 
  getTaskDetails, updateTask, addTaskComment, RMTask 
} from '../../services/api.js';
import { getBusinessLeadId } from './UnderwritingModal.js';

interface RMActionCenterProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  customerData: any; // Fallback customer data if task loading is deferred
  onActionCompleted: () => void;
}

export const RMActionCenter: React.FC<RMActionCenterProps> = ({
  isOpen,
  onClose,
  taskId,
  customerData,
  onActionCompleted
}) => {
  const [taskDetails, setTaskDetails] = useState<RMTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Note Text Area
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchTaskInfo = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const details = await getTaskDetails(taskId);
      setTaskDetails(details);
    } catch (e: any) {
      setError(e.message || 'Failed to retrieve opportunity details.');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskInfo();
      setNoteText('');
    } else {
      setTaskDetails(null);
    }
  }, [isOpen, taskId, fetchTaskInfo]);

  // Handle ESC close
  useEffect(() => {
    const handleESC = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleESC);
    }
    return () => window.removeEventListener('keydown', handleESC);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use loaded task customer or the fallback customerData passed in
  const customer = taskDetails?.customer || customerData;
  if (!customer) return null;

  // Deterministic credit variables
  const numericPart = parseInt(customer.id.replace(/\D/g, ''), 10) || 42;
  const leadScore = (numericPart % 25) + 75;
  const aiConfidence = (numericPart % 15) + 84;
  const repaymentCapacity = Math.min(99, leadScore - 3);

  // Income Estimate
  const declaredIncome = customer.segment === 'MSME' 
    ? 120000 + (numericPart % 10) * 12500 
    : 45000 + (numericPart % 10) * 12500;
  const estimatedIncome = Math.round(declaredIncome * 1.15);
  const incomeEstimate = `₹${estimatedIncome.toLocaleString('en-IN')}/mo`;

  // Sizing Opportunity
  const baseOpportunity = customer.segment === 'MSME' ? 25 : 5;
  const opportunityLakhs = baseOpportunity + (numericPart % 5) * (customer.segment === 'MSME' ? 6 : 5);
  const opportunityAmount = `₹${opportunityLakhs}L`;

  const recommendedProduct = customer.segment === 'MSME' ? 'MSME Mortgage Loan' : 'Retail Home Loan';
  const businessLeadId = getBusinessLeadId(customer.id);

  // Determine current stage
  const rawStatus = taskDetails?.status || 'Pending';
  const getMappedStatus = (id: string, status: string): string => {
    const lendingStages = [
      'AI Identified', 'RM Contacted', 'Income Verified', 
      'Documents Submitted', 'Underwriting', 'Loan Approved', 
      'Rejected', 'Disbursed'
    ];
    if (lendingStages.includes(status)) return status;

    // Fallback for seeded values
    const num = parseInt(id.replace(/\D/g, ''), 10) || 0;
    if (status === 'Pending') {
      return num % 2 === 0 ? 'AI Identified' : 'RM Contacted';
    }
    if (status === 'In Progress') {
      return num % 2 === 0 ? 'Income Verified' : 'Documents Submitted';
    }
    if (status === 'Waiting Customer') {
      return 'Underwriting';
    }
    const rem = num % 3;
    if (rem === 0) return 'Loan Approved';
    if (rem === 1) return 'Disbursed';
    return 'Rejected';
  };

  const currentStage = taskId ? getMappedStatus(taskId, rawStatus) : 'AI Identified';

  let priority = 'Nurture';
  if (leadScore > 90) priority = 'Immediate';
  else if (leadScore > 82) priority = 'High Potential';
  else if (leadScore < 78) priority = 'Monitor';

  // Stage to Actions Definition
  const STAGE_ACTIONS: Record<string, { label: string; transition?: string; defaultComment: string }[]> = {
    'AI Identified': [
      { label: 'Call Customer', defaultComment: 'Relationship Manager initiated introductory call with customer.' },
      { label: 'Schedule Eligibility Discussion', transition: 'RM Contacted', defaultComment: 'Scheduled loan eligibility and product mapping discussion.' },
      { label: 'Send Loan Interest Message', defaultComment: 'Sent official retail lending interest alert communication.' },
      { label: 'Mark No Response', defaultComment: 'Attempted customer contact: No response received.' },
      { label: 'Reject Lead', transition: 'Rejected', defaultComment: 'Lead qualified out: Does not align with current credit underwriting benchmarks.' }
    ],
    'RM Contacted': [
      { label: 'Mark Customer Interested', transition: 'Income Verified', defaultComment: 'Customer confirmed interest in recommended loan product. Proceeding to income check.' },
      { label: 'Mark Customer Not Interested', transition: 'Rejected', defaultComment: 'Customer declined loan eligibility offering.' },
      { label: 'Request Income Documents', transition: 'Income Verified', defaultComment: 'Requested official salary credits, Form 16, and bank statements.' },
      { label: 'Request KYC Documents', defaultComment: 'Requested official identity and address validation documents.' },
      { label: 'Schedule Branch Meeting', defaultComment: 'Scheduled face-to-face consultation at IDBI Bank branch.' },
      { label: 'Add Follow-up', defaultComment: 'Registered follow-up reminder callback.' }
    ],
    'Income Verified': [
      { label: 'Income Verified', transition: 'Documents Submitted', defaultComment: 'AI estimated income verified against bank statements credit entries.' },
      { label: 'Request Additional Documents', defaultComment: 'Requested supplementary credit proofs and tax filings.' },
      { label: 'Escalate to Credit Team', transition: 'Underwriting', defaultComment: 'Escalated file to Credit Risk & Underwriting desk for formal limits vetting.' },
      { label: 'Schedule Verification Call', defaultComment: 'Scheduled employment/salary credit verification interview.' }
    ],
    'Documents Submitted': [
      { label: 'Forward to Underwriting', transition: 'Underwriting', defaultComment: 'Forwarded complete KYC and verified income files to credit underwriting.' },
      { label: 'Request Missing Documents', defaultComment: 'Sent notification to borrower to upload missing checklist documents.' },
      { label: 'Return to RM', transition: 'RM Contacted', defaultComment: 'Returned dossier to Relationship Manager for details rectification.' }
    ],
    'Underwriting': [
      { label: 'Await Decision', defaultComment: 'Awaiting final credit committee underwriting decision.' },
      { label: 'Return for Clarification', transition: 'Documents Submitted', defaultComment: 'Credit team returned file requesting additional income clarification.' }
    ],
    'Loan Approved': [
      { label: 'Schedule Disbursement Meeting', defaultComment: 'Scheduled agreement execution and disbursement briefing.' },
      { label: 'Notify Customer', defaultComment: 'Notified customer of formal credit approval and interest structure.' }
    ],
    'Rejected': [
      { label: 'Archive Opportunity', defaultComment: 'Archived rejected lead file.' },
      { label: 'Schedule Future Follow-up', defaultComment: 'Scheduled future follow-up checking in 6 months.' }
    ],
    'Disbursed': []
  };

  const availableActions = STAGE_ACTIONS[currentStage] || [];

  // Execute stage action
  const handleActionClick = async (action: typeof availableActions[0]) => {
    if (!taskId) return;
    setActionInProgress(action.label);
    try {
      // 1. Add timeline comment representing the action
      await addTaskComment(taskId, `[ACTION TAKEN] ${action.label}: ${action.defaultComment}`);
      
      // 2. Transition stage if specified
      if (action.transition) {
        await updateTask(taskId, { status: action.transition });
      }

      // 3. Re-fetch details to update timeline inside drawer
      await fetchTaskInfo();
      
      // 4. Trigger parent callback to refresh main list & dashboard KPIs
      onActionCompleted();
    } catch (e: any) {
      alert(e.message || 'Failed to complete action');
    } finally {
      setActionInProgress(null);
    }
  };

  // Add notes comment
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !taskId) return;
    setSavingNote(true);
    try {
      await addTaskComment(taskId, `[RM NOTE] ${noteText.trim()}`);
      setNoteText('');
      await fetchTaskInfo();
      onActionCompleted();
    } catch (e: any) {
      alert(e.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  // Compile Chronological Timeline Events
  const compileTimeline = () => {
    if (!taskDetails) return [];
    
    const events: { title: string; desc: string; author: string; time: string; timestamp: Date }[] = [];

    // Add seeded comments
    if (taskDetails.comments) {
      taskDetails.comments.forEach(c => {
        const text = c.comment || '';
        let title = 'Action Taken';
        let desc = text;
        
        if (text.startsWith('[ACTION TAKEN] ')) {
          const split = text.replace('[ACTION TAKEN] ', '').split(': ');
          title = split[0] || 'Action Taken';
          desc = split[1] || text;
        } else if (text.startsWith('[RM NOTE] ')) {
          title = 'RM Observation Note';
          desc = text.replace('[RM NOTE] ', '');
        } else {
          title = 'Observation Note Added';
        }

        events.push({
          title,
          desc,
          author: c.author?.name || 'Relationship Manager',
          time: new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(c.createdAt)
        });
      });
    }

    // Add status history updates
    if (taskDetails.history) {
      taskDetails.history.forEach(h => {
        if (h.fieldName === 'status') {
          events.push({
            title: `Stage Moved to ${getMappedStatus(taskDetails.id, h.newValue || '')}`,
            desc: `Pipeline status transitioned from ${getMappedStatus(taskDetails.id, h.oldValue || '')} to ${getMappedStatus(taskDetails.id, h.newValue || '')}.`,
            author: h.changedBy?.name || 'System Auto-Qualify',
            time: new Date(h.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date(h.createdAt)
          });
        }
      });
    }

    // Add initial AI Qualify signal
    if (taskDetails.createdAt) {
      events.push({
        title: 'Lead AI Qualified',
        desc: `ProspectIQ AI qualified borrower with a Credit score of ${leadScore}% and confidence level of ${aiConfidence}%.`,
        author: 'ProspectIQ Engine',
        time: new Date(taskDetails.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(taskDetails.createdAt)
      });
    }

    // Sort chronologically (newest first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const timelineEvents = compileTimeline();

  const getRiskBadge = (risk: string) => {
    if (risk === 'HIGH') return 'bg-red-50 border-red-200 text-red-700';
    if (risk === 'MEDIUM') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  const getPriorityBadge = (prio: string) => {
    if (prio === 'Immediate') return 'bg-red-50 border-red-200 text-red-700';
    if (prio === 'High Potential') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-semibold text-xs text-gray-800">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in-overlay"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-50 flex flex-col animate-slide-in-drawer">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F6F8FA]">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-[#006A4E]" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">ProspectIQ AI Action Center</h2>
              <span className="text-[9px] uppercase tracking-wider text-[#6A737D] font-bold block mt-0.5">IDBI Bank RM Operations Desk</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200/80 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          
          {/* Customer Metadata Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm space-y-3.5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{customer.name}</h3>
                <span className="text-[10px] text-[#6A737D] font-mono leading-none">{businessLeadId}</span>
              </div>
              <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase ${getRiskBadge(customer.riskCategory)}`}>
                {customer.riskCategory} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] bg-[#F6F8FA] p-3 rounded-lg border border-[#E5E7EB]">
              <div>Recommended Product: <strong className="text-gray-950 block">{recommendedProduct}</strong></div>
              <div>Estimated Sizing: <strong className="text-gray-950 block">{opportunityAmount}</strong></div>
              <div>Estimated Income: <strong className="text-gray-950 block">{incomeEstimate}</strong></div>
              <div>Repayment Capacity: <strong className="text-[#006A4E] block">{repaymentCapacity}% Index</strong></div>
              <div>Lead Score: <strong className="text-gray-950 block">{leadScore}%</strong></div>
              <div>AI Confidence: <strong className="text-[#006A4E] block">{aiConfidence}%</strong></div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-1">
              <div>Current Stage: <span className="font-bold text-emerald-800 uppercase text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{currentStage}</span></div>
              <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md ${getPriorityBadge(priority)}`}>
                {priority} Priority
              </span>
            </div>
          </div>

          {/* Action List Section */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-gray-700 tracking-wider flex items-center gap-1.5">
              <Check className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Recommended Workflow Actions</span>
            </h4>
            
            {loading ? (
              <div className="flex items-center justify-center p-6 space-x-2">
                <Loader2 className="h-4 w-4 text-[#006A4E] animate-spin" />
                <span className="text-[10px] text-[#6A737D]">Retrieving available workflow triggers...</span>
              </div>
            ) : availableActions.length === 0 ? (
              <div className="p-4 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg text-center font-medium italic text-gray-500">
                No active actions available in the Disbursed stage.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {availableActions.map((action, idx) => {
                  const isDoing = actionInProgress === action.label;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      disabled={!!actionInProgress}
                      className="w-full py-2.5 px-4 bg-[#EAF6F2] hover:bg-[#d4ece3] disabled:opacity-50 text-[#006A4E] hover:text-[#00563F] font-bold rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer border border-[#006A4E]/25 shadow-sm"
                    >
                      <span className="flex items-center space-x-2">
                        {isDoing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        <span>{action.label}</span>
                      </span>
                      {action.transition && (
                        <span className="text-[9px] bg-[#006A4E]/10 text-[#006A4E] px-2 py-0.5 rounded font-bold">
                          Move to {action.transition}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <form onSubmit={handleAddNote} className="space-y-2 border-t border-[#E5E7EB]/70 pt-4">
            <label className="text-xs uppercase font-bold text-gray-700 tracking-wider block">Relationship Manager Observations</label>
            <textarea
              placeholder="Record notes e.g., Customer confirmed salary increase. Will upload Form 16 tomorrow."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E] min-h-[70px] placeholder-gray-400"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingNote || !noteText.trim()}
                className="py-2 px-4 bg-[#EAF6F2] hover:bg-[#d4ece3] text-[#006A4E] hover:text-[#00563F] disabled:opacity-40 disabled:hover:bg-[#EAF6F2] disabled:hover:text-[#006A4E] font-bold rounded-lg text-xs transition-all border border-[#006A4E]/25 cursor-pointer shadow-sm"
              >
                {savingNote ? 'Saving Observation...' : 'Save RM Note'}
              </button>
            </div>
          </form>

          {/* Chronological Action Timeline */}
          <div className="space-y-3.5 border-t border-[#E5E7EB]/70 pt-4">
            <h4 className="text-xs uppercase font-bold text-gray-700 tracking-wider flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-[#F58220]" />
              <span>Chronological Action Timeline</span>
            </h4>
            
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 text-[#006A4E] animate-spin" />
              </div>
            ) : timelineEvents.length === 0 ? (
              <div className="p-4 text-center italic text-[#6A737D]">No timeline logs found.</div>
            ) : (
              <div className="relative border-l border-gray-200 ml-2.5 pl-4 space-y-4 text-[10px]">
                {timelineEvents.map((ev, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    {/* Circle Bullet */}
                    <span className="absolute -left-[21.5px] top-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-[#006A4E]" />
                    
                    <div className="flex justify-between items-center font-bold">
                      <strong className="text-gray-900">{ev.title}</strong>
                      <span className="text-[8px] text-[#6A737D] font-mono">{ev.time}</span>
                    </div>
                    <p className="text-gray-600 font-medium leading-tight">{ev.desc}</p>
                    <span className="text-[8px] text-[#6A737D] block font-semibold">Logged by: {ev.author}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

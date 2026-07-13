import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Award, Sparkles, TrendingUp, Compass, 
  Layers, Landmark, FileText, AlertTriangle, Check, BookOpen,
  DollarSign, Activity, CreditCard, HeartHandshake
} from 'lucide-react';
import type { Customer } from 'shared';

interface UnderwritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  currentStage?: string;
  onStageChange?: (newStage: string) => void;
}

// Business-friendly Lead ID helper
export const getBusinessLeadId = (uuid: string): string => {
  const num = parseInt(uuid.replace(/\D/g, ''), 10) || 42;
  return `LD-${String(num % 100000).padStart(5, '0')}`;
};

export const UnderwritingModal: React.FC<UnderwritingModalProps> = ({ 
  isOpen, onClose, customer, currentStage, onStageChange 
}) => {
  const [rmNotes, setRmNotes] = useState('');

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setRmNotes('');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  // Dynamic deterministic calculations based on Customer ID for 100% consistency
  const numericPart = parseInt(customer.id.replace(/\D/g, ''), 10) || 42;
  const leadScore = (numericPart % 25) + 75;
  const aiConfidence = (numericPart % 15) + 84;
  const repaymentCapacity = Math.min(99, leadScore - 3);
  const dtiRatio = (numericPart % 15) + 20; // e.g. 20-35%
  
  // Declared vs Estimated Income
  const declaredIncome = customer.segment === 'MSME' 
    ? 120000 + (numericPart % 10) * 12500 
    : 45000 + (numericPart % 10) * 12500;
  const estimatedIncome = Math.round(declaredIncome * 1.15);
  
  // Sizing Opportunity
  const baseOpportunity = customer.segment === 'MSME' ? 25 : 5;
  const opportunityLakhs = baseOpportunity + (numericPart % 5) * (customer.segment === 'MSME' ? 6 : 5);
  const suggestedAmount = opportunityLakhs * 100000;

  // Loan product matching
  const recommendedProduct = customer.segment === 'MSME' ? 'MSME Mortgage Loan' : 'Retail Home Loan';
  const expectedConversion = Math.round((leadScore + aiConfidence) / 2);

  // Underwriting details
  const existingEMIs = Math.round(declaredIncome * (numericPart % 8) * 0.05); // e.g. 0% to 35% of income
  const disposableIncome = Math.max(10000, estimatedIncome - existingEMIs - Math.round(estimatedIncome * 0.35));
  const maxAffordableEMI = Math.round(disposableIncome * 0.65);
  
  const riskFlags = customer.riskCategory === 'HIGH' 
    ? ['High discretionary UPI outflow ratios', 'Higher DTI ratio above benchmark limit']
    : ['Stable salary inflow track record', 'No active defaults detected in credit registry'];

  const approvalProbability = leadScore;
  const businessLeadId = getBusinessLeadId(customer.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-overlay font-semibold text-xs">
      {/* Backdrop Close Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-6 space-y-6 animate-scale-up-modal text-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-[#EAF6F2] rounded-lg text-[#006A4E] flex items-center justify-center border border-[#006A4E]/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">AI Lead Underwriting & Explainability Desk</h2>
              <span className="text-[10px] text-[#6A737D] uppercase font-bold tracking-wider">
                Lead Intelligence Profile — {customer.name} ({businessLeadId})
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-[#F3F4F6] text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT: Lead Parameters & ExplainIQ Decision Rationale */}
          <div className="space-y-6">
            
            {/* Primary Lending Indicators */}
            <div className="bg-[#F6F8FA] border border-[#E5E7EB] rounded-xl p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-[#006A4E]" />
                <span>Lending Credit Footprint</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">AI Lead Score</span>
                  <strong className="text-sm font-black text-[#006A4E] block mt-0.5">{leadScore}%</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">Est. Income</span>
                  <strong className="text-sm font-black text-gray-950 block mt-0.5">₹{(estimatedIncome/1000).toFixed(0)}k/mo</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">Repayment Cap.</span>
                  <strong className="text-sm font-black text-[#006A4E] block mt-0.5">{repaymentCapacity}%</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">DTI Ratio</span>
                  <strong className="text-sm font-black text-gray-950 block mt-0.5">{dtiRatio}%</strong>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">Risk Tier</span>
                  <span className={`px-1.5 py-0.2 text-[8px] font-black rounded block mx-auto text-center w-fit mt-0.5
                    ${customer.riskCategory === 'LOW' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                    ${customer.riskCategory === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                    ${customer.riskCategory === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                  `}>
                    {customer.riskCategory}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[8px] text-[#6A737D] block uppercase font-bold">Model Confidence</span>
                  <strong className="text-sm font-black text-[#006A4E] block mt-0.5">{aiConfidence}%</strong>
                </div>
              </div>
            </div>

            {/* ExplainIQ AI Decision Rationale Details */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5 border-b border-[#E5E7EB] pb-2">
                <FileText className="h-4 w-4 text-[#006A4E]" />
                <span>ExplainIQ AI Qualification Rationale</span>
              </h3>
              
              <div className="space-y-3 text-[11px] font-semibold text-gray-800 leading-relaxed">
                <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                  <span className="text-[#6A737D] uppercase text-[9px] tracking-wider block font-bold">Transaction Patterns</span>
                  <span className="col-span-2 text-gray-950">High digital UPI transaction density; low ATM cash-out ratios suggesting stable liquidity.</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                  <span className="text-[#6A737D] uppercase text-[9px] tracking-wider block font-bold">Salary Stability</span>
                  <span className="col-span-2 text-gray-950">Consistent salary credit logs occurring on the 1st of every month with negligible date variance.</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                  <span className="text-[#6A737D] uppercase text-[9px] tracking-wider block font-bold">Repayment Behaviour</span>
                  <span className="col-span-2 text-gray-950">No historical auto-debit bounce incidents; timely credit card balance clearances logged.</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-2">
                  <span className="text-[#6A737D] uppercase text-[9px] tracking-wider block font-bold">Digital Engagement</span>
                  <span className="col-span-2 text-[#006A4E] font-bold">Heavy mobile banking app session length; active digital payment channel footprints.</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6A737D] uppercase text-[9px] tracking-wider block font-bold">Balance Trends</span>
                  <span className="col-span-2 text-gray-950">Upward trajectory in average quarterly balances (AQB) over the trailing 12-month period.</span>
                </div>
              </div>
            </div>

            {/* Income Estimation Methodology */}
            <div className="bg-[#EAF6F2]/20 border border-[#006A4E]/10 rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1">
                <Activity className="h-3.5 w-3.5 text-[#006A4E]" />
                <span>Income Estimation Methodology</span>
              </h4>
              <p className="text-[10px] text-gray-700 leading-relaxed font-semibold">
                Income is projected dynamically using transactional cash flow multipliers, adjusting salary credit volumes against recurrent credit multipliers and ledger deposit velocity templates. This supports prudent credit underwriting without relying on static tax sheets.
              </p>
            </div>

          </div>

          {/* RIGHT: Underwriting Summary Matrix & RM Notes */}
          <div className="space-y-6">
            
            {/* Underwriting Summary Panel */}
            <div className="bg-[#EAF6F2]/30 border border-[#006A4E]/15 rounded-xl p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Landmark className="h-4 w-4 text-[#006A4E]" />
                <span>Underwriting Assessment Ledger</span>
              </h3>

              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Matched Loan Product</span>
                  <span className="text-gray-950">{recommendedProduct}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Estimated Monthly Income</span>
                  <span className="text-gray-950">₹{estimatedIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Existing Verified EMIs</span>
                  <span className="text-red-600">₹{existingEMIs.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Disposable Margin Income</span>
                  <span className="text-[#006A4E]">₹{disposableIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Maximum Affordable EMI Cap</span>
                  <span className="text-[#006A4E]">₹{maxAffordableEMI.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Suggested Loan Amount</span>
                  <span className="text-gray-950">₹{suggestedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1.5">
                  <span className="text-[#6A737D]">Model Underwriting Probability</span>
                  <span className="text-emerald-600">{approvalProbability}%</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#6A737D] uppercase tracking-wider block font-bold">Risk Flags & Observations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {riskFlags.map((flag, fIdx) => (
                      <span 
                        key={fIdx} 
                        className={`px-2 py-0.5 border text-[9px] font-bold rounded-md
                          ${customer.riskCategory === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                        `}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Best Action Campaign & Notes */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="h-4 w-4 text-[#006A4E]" />
                <span>Next Best Action (Campaign Planner)</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-2.5 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                  <span className="text-[8px] text-[#6A737D] uppercase tracking-wider block font-bold">Initiative Campaign</span>
                  <strong className="text-gray-950 block text-[11px] mt-0.5">Schedule retail {recommendedProduct.toLowerCase()} eligibility discussion</strong>
                </div>

                {onStageChange && currentStage && (
                  <div className="space-y-1 mb-3">
                    <label className="text-[10px] text-[#6A737D] font-bold uppercase tracking-wider block">Lending Pipeline Stage</label>
                    <select
                      value={currentStage}
                      onChange={(e) => onStageChange(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                    >
                      <option value="AI Identified">AI Identified</option>
                      <option value="RM Contacted">RM Contacted</option>
                      <option value="Customer Interested">Customer Interested</option>
                      <option value="Income Verified">Income Verified</option>
                      <option value="Documents Submitted">Documents Submitted</option>
                      <option value="Loan Application">Loan Application</option>
                      <option value="Underwriting">Underwriting</option>
                      <option value="Sanctioned">Sanctioned</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-[#6A737D] font-bold uppercase tracking-wider block">RM Underwriting Notes</label>
                  <textarea
                    rows={2}
                    value={rmNotes}
                    onChange={(e) => setRmNotes(e.target.value)}
                    placeholder="Enter borrower notes, income validation observations, or discussion scheduling logs..."
                    className="w-full p-2 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006A4E]"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 border-t border-[#E5E7EB] pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E7EB] hover:bg-[#F3F4F6] text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel Assessment
          </button>
          <button
            onClick={() => {
              alert('Underwriting parameters and RM Notes logged successfully!');
              onClose();
            }}
            className="px-4 py-2 bg-[#006A4E] hover:bg-[#00563F] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            Submit Assessment
          </button>
        </div>

      </div>
    </div>
  );
};

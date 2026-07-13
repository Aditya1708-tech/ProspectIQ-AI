import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { getCustomers, getTasks, createTask } from '../services/api.js';
import { UnderwritingModal, getBusinessLeadId } from '../components/customer/UnderwritingModal.js';
import { RMActionCenter } from '../components/customer/RMActionCenter.js';
import { 
  Search, ArrowLeft, ArrowRight, Loader2, AlertCircle, 
  ChevronUp, ChevronDown, Award, TrendingUp, ShieldCheck, Target, Activity
} from 'lucide-react';
import { Layout } from '../components/layout/Layout.js';
import type { Customer, PaginationMeta } from 'shared';
import type { RMTask } from '../services/api.js';

// Backward compatible stage mapper helper
export const getMappedStatus = (id: string, status: string): string => {
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

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<RMTask[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 1
  });

  const [search, setSearch] = useState(urlSearch);
  const [riskCategory, setRiskCategory] = useState<string | undefined>(undefined);

  const [sortField, setSortField] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Underwriting Modal state (View AI Analysis)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RM Action Center state (Take Action)
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const fetchCustomersList = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const [custRes, tasksRes] = await Promise.all([
        getCustomers({
          page,
          limit: 100,
          sort: sortField,
          order: sortOrder,
          search: search || undefined,
          riskCategory
        }),
        getTasks()
      ]);
      setCustomers(custRes.data || []);
      setTasks(notNull(tasksRes) || []);
      setPagination(custRes.pagination);
    } catch (e: any) {
      setError(e.message || 'Failed to load lead profiles.');
    } finally {
      setLoading(false);
    }
  }, [search, riskCategory, sortField, sortOrder]);

  const notNull = (val: any) => {
    return Array.isArray(val) ? val : [];
  };

  useEffect(() => {
    fetchCustomersList(1);
  }, [fetchCustomersList]);

  const handleClearFilters = () => {
    setRiskCategory(undefined);
    setSearch('');
  };

  const handleSort = (field: 'name' | 'createdAt') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Helper calculating identical credit variables for 100% alignment
  const getClientLendingScores = (id: string, riskCat: string, clientSegment: string) => {
    const numericPart = parseInt(id.replace(/\D/g, ''), 10) || 42;
    const leadScore = (numericPart % 25) + 75;
    const aiConfidence = (numericPart % 15) + 84;
    const repaymentCapacity = Math.min(99, leadScore - 3);
    const loanReadiness = leadScore > 82 ? 'READY' : 'MONITOR';
    const conversionProbability = Math.round((leadScore + aiConfidence) / 2);
    
    // Income Estimate: range based on segment
    const baseIncome = clientSegment === 'MSME' 
      ? 120000 + (numericPart % 10) * 12500 
      : 45000 + (numericPart % 10) * 12500;
    const estimatedIncome = Math.round(baseIncome * 1.15);
    const incomeEstimate = `₹${estimatedIncome.toLocaleString('en-IN')}/mo`;

    // Sizing Opportunity
    const baseOpportunity = clientSegment === 'MSME' ? 25 : 5;
    const opportunityLakhs = baseOpportunity + (numericPart % 5) * (clientSegment === 'MSME' ? 6 : 5);
    const opportunityAmount = `₹${opportunityLakhs}L`;

    let priority = 'Nurture';
    if (leadScore > 90) priority = 'Immediate';
    else if (leadScore > 82) priority = 'High Potential';
    else if (leadScore < 78) priority = 'Monitor';

    const recommendedProduct = clientSegment === 'MSME' ? 'MSME Mortgage Loan' : 'Retail Home Loan';
    const nextBestAction = `Schedule retail ${recommendedProduct.toLowerCase()} consultation`;
    const aiExplainabilityScore = `${repaymentCapacity}% Index`;

    return { 
      leadScore, 
      aiConfidence, 
      incomeEstimate, 
      repaymentCapacity, 
      loanReadiness, 
      conversionProbability, 
      opportunityAmount, 
      priority,
      recommendedProduct,
      nextBestAction,
      aiExplainabilityScore
    };
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'HIGH') return 'bg-red-50 border-red-200 text-red-700';
    if (risk === 'MEDIUM') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  // Maps stages to custom hackathon status badges
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'AI Identified':
        return { label: 'AI Qualified', classes: 'bg-[#F6F8FA] border-[#E5E7EB] text-[#1F2937]' };
      case 'RM Contacted':
        return { label: 'Awaiting RM Contact', classes: 'bg-blue-50 border-blue-200 text-blue-700' };
      case 'Income Verified':
        return { label: 'Income Verification', classes: 'bg-amber-50 border-amber-200 text-amber-700' };
      case 'Documents Submitted':
        return { label: 'Documents Pending', classes: 'bg-indigo-50 border-indigo-200 text-indigo-700' };
      case 'Underwriting':
        return { label: 'Underwriting', classes: 'bg-yellow-50 border-yellow-200 text-yellow-700' };
      case 'Loan Approved':
        return { label: 'Approved', classes: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
      case 'Rejected':
        return { label: 'Rejected', classes: 'bg-red-50 border-red-200 text-red-700' };
      case 'Disbursed':
        return { label: 'Disbursed', classes: 'bg-teal-50 border-teal-200 text-teal-700' };
      default:
        return { label: 'AI Qualified', classes: 'bg-[#F6F8FA] border-[#E5E7EB] text-[#1F2937]' };
    }
  };

  // Launch action center
  const handleTakeActionClick = async (c: Customer) => {
    const existingTask = tasks.find(t => t.customerId === c.id);
    if (existingTask) {
      setSelectedTaskId(existingTask.id);
      setSelectedCustomer(c);
      setIsActionCenterOpen(true);
    } else {
      // Auto-create task on the fly to support full persistent update pipeline
      setLoading(true);
      try {
        const { recommendedProduct } = getClientLendingScores(c.id, c.riskCategory, c.segment);
        const created = await createTask({
          title: `Retail Lending: ${recommendedProduct}`,
          description: `Auto-qualified retail lending opportunity for ${c.name}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'MEDIUM',
          category: 'Opportunity',
          customerId: c.id
        });
        
        // Reload tasks list
        const tasksRes = await getTasks();
        setTasks(notNull(tasksRes) || []);
        
        setSelectedTaskId(created.id);
        setSelectedCustomer(c);
        setIsActionCenterOpen(true);
      } catch (err: any) {
        alert('Failed to initialize opportunity: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter to show ONLY AI-qualified prospects (Lead Score >= 80)
  const qualifiedCustomers = customers.filter(c => {
    const scores = getClientLendingScores(c.id, c.riskCategory, c.segment);
    return scores.leadScore >= 80;
  });

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Filters Panel */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4 font-semibold text-xs text-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search qualified leads/prospects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E] placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={riskCategory || ''}
                onChange={(e) => setRiskCategory(e.target.value || undefined)}
                className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 bg-white text-xs text-gray-950 font-semibold focus:outline-none focus:border-[#006A4E]"
              >
                <option value="">All Risk Tiers</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>

              {(search || riskCategory) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#6A737D] font-bold bg-[#F6F8FA] sticky top-0 select-none">
                  <th className="p-3.5 cursor-pointer hover:bg-[#EAF6F2] hover:text-[#006A4E] transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center space-x-1">
                      <span>Customer Name</span>
                      {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="p-3.5">Recommended Loan Product</th>
                  <th className="p-3.5">Estimated Opportunity</th>
                  <th className="p-3.5 text-center">Lead Score</th>
                  <th className="p-3.5 text-center">AI Confidence</th>
                  <th className="p-3.5">Income Estimate</th>
                  <th className="p-3.5 text-center">Repayment Capacity</th>
                  <th className="p-3.5 text-center">Risk Tier</th>
                  <th className="p-3.5 text-center">Current Stage</th>
                  <th className="p-3.5">Next Best Action</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && customers.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-[#6A737D]">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 text-[#006A4E] animate-spin" />
                        <span className="font-bold">Syncing active portfolios...</span>
                      </div>
                    </td>
                  </tr>
                ) : qualifiedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-[#6A737D] font-medium italic">
                      No AI-qualified prospects matching query filters found.
                    </td>
                  </tr>
                ) : (
                  qualifiedCustomers.map((c) => {
                    const { 
                      leadScore, 
                      aiConfidence, 
                      incomeEstimate, 
                      repaymentCapacity,
                      opportunityAmount,
                      recommendedProduct,
                      nextBestAction
                    } = getClientLendingScores(c.id, c.riskCategory, c.segment);

                    const businessLeadId = getBusinessLeadId(c.id);

                    // Find corresponding task for status checking
                    const matchingTask = tasks.find(t => t.customerId === c.id);
                    const stage = matchingTask ? getMappedStatus(matchingTask.id, matchingTask.status) : 'AI Identified';
                    const badge = getStageBadge(stage);

                    return (
                      <tr key={c.id} className="border-b border-[#E5E7EB] hover:bg-gray-50/50 transition-colors font-medium text-gray-800">
                        {/* Name & ID */}
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-[#EAF6F2] border border-[#006A4E]/10 rounded-full flex items-center justify-center text-[#006A4E] font-extrabold text-[10px] shadow-inner">
                              {c.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block leading-tight">{c.name}</span>
                              <span className="text-[10px] text-[#6A737D] font-mono leading-none">{businessLeadId}</span>
                            </div>
                          </div>
                        </td>

                        {/* Recommended Loan Product */}
                        <td className="p-3.5 text-gray-950 font-bold">{recommendedProduct}</td>

                        {/* Estimated Opportunity */}
                        <td className="p-3.5 text-gray-800 font-bold">{opportunityAmount}</td>

                        {/* Lead Score */}
                        <td className="p-3.5 text-center font-mono font-bold text-gray-950">{leadScore}%</td>

                        {/* AI Confidence */}
                        <td className="p-3.5 text-center font-mono font-bold text-[#006A4E]">{aiConfidence}%</td>

                        {/* Income Estimate */}
                        <td className="p-3.5 font-bold text-gray-900">{incomeEstimate}</td>

                        {/* Repayment Capacity */}
                        <td className="p-3.5 text-center font-mono font-bold text-[#006A4E]">{repaymentCapacity}%</td>

                        {/* Risk Tier */}
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase ${getRiskBadge(c.riskCategory)}`}>
                            {c.riskCategory}
                          </span>
                        </td>

                        {/* Current Stage */}
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md uppercase ${badge.classes}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Next Best Action */}
                        <td className="p-3.5 font-bold text-gray-700">{nextBestAction}</td>

                        {/* Actions */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedCustomer(c); setIsModalOpen(true); }}
                              className="px-2.5 py-1.5 bg-[#EAF6F2] hover:bg-[#d4ece3] text-[#006A4E] hover:text-[#00563F] rounded-md text-[10px] font-bold border border-[#006A4E]/15 cursor-pointer transition-all"
                            >
                              View AI Analysis
                            </button>
                            <button
                              onClick={() => handleTakeActionClick(c)}
                              className="px-2.5 py-1.5 bg-[#EAF6F2] hover:bg-[#d4ece3] text-[#006A4E] hover:text-[#00563F] rounded-md text-[10px] font-bold border border-[#006A4E]/25 cursor-pointer transition-all shadow-sm"
                            >
                              Take Action
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ExplainIQ Underwriting Modal */}
        <UnderwritingModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }} 
          customer={selectedCustomer} 
        />

        {/* RM Action Center slide-over drawer */}
        <RMActionCenter
          isOpen={isActionCenterOpen}
          onClose={() => { setIsActionCenterOpen(false); setSelectedTaskId(null); setSelectedCustomer(null); }}
          taskId={selectedTaskId}
          customerData={selectedCustomer}
          onActionCompleted={() => {
            // Hot refresh data synchronously
            fetchCustomersList(1);
          }}
        />

      </div>
    </Layout>
  );
};

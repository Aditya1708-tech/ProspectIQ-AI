import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { getDashboardData, getCustomers, getTasks } from '../services/api.js';
import { Layout } from '../components/layout/Layout.js';
import { UnderwritingModal, getBusinessLeadId } from '../components/customer/UnderwritingModal.js';
import {
  Users, Sparkles, TrendingUp, AlertTriangle, Check, LogOut, 
  RefreshCw, Activity, Loader2, AlertCircle, Clock, ArrowRight, 
  Award, Briefcase, Bell, Search, ShieldCheck, CheckCircle, FileText,
  TrendingDown, DollarSign, Landmark, Layers, Target, Home, Compass, BarChart2
} from 'lucide-react';
import type { Customer } from 'shared';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Underwriting Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [custRes, tasksRes] = await Promise.all([
        getCustomers({ page: 1, limit: 100, sort: 'name', order: 'asc' }),
        getTasks()
      ]);
      setCustomers(custRes.data || []);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
    } catch (err: any) {
      setError(err.message || 'Failed to sync lead intelligence.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-[#006A4E] animate-spin" />
        <span className="text-xs text-[#6A737D] font-bold uppercase tracking-wider">Loading retail lending command desk...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-md space-y-4 shadow-lg text-xs font-semibold text-gray-800">
          <AlertCircle className="h-10 w-10 text-red-600 animate-bounce" />
          <h3 className="text-lg font-bold text-gray-900">Dashboard Offline</h3>
          <p className="text-xs text-[#6A737D]">{error}</p>
          <button
            onClick={() => fetchDashboard()}
            className="w-full py-2.5 px-4 bg-[#006A4E] hover:bg-[#00563F] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const roles = user?.roles || [];

  // ==========================================
  // RELATIONSHIP MANAGER HOME DASHBOARD
  // ==========================================
  const renderRmDashboard = () => {
    // Dynamic KPI calculations from RM portfolio (first 100 leads)
    const leadPipeline = customers.length || 150;
    
    let highQualityLeadsCount = 0;
    let totalLendingOpportunityLakhs = 0;
    let confidenceSum = 0;
    let conversionSum = 0;

    // Pipeline stage counts from actual data
    let cntIdentified = 0;
    let cntContacted = 0;
    let cntVerified = 0;
    let cntSubmitted = 0;
    let cntUnderwriting = 0;
    let cntApproved = 0;

    const scoringCache = customers.map(c => {
      const numericPart = parseInt(c.id.replace(/\D/g, ''), 10) || 42;
      const leadScore = (numericPart % 25) + 75;
      const aiConfidence = (numericPart % 15) + 84;
      const expectedConversion = Math.round((leadScore + aiConfidence) / 2);

      // Sizing
      const baseOpportunity = c.segment === 'MSME' ? 25 : 5;
      const opportunityLakhs = baseOpportunity + (numericPart % 5) * (c.segment === 'MSME' ? 6 : 5);

      if (leadScore >= 80) highQualityLeadsCount++;
      totalLendingOpportunityLakhs += opportunityLakhs;
      confidenceSum += aiConfidence;
      conversionSum += expectedConversion;

      // Map status counts from actual task status in the database
      const getMappedStatus = (id: string, status: string): string => {
        const lendingStages = [
          'AI Identified', 'RM Contacted', 'Income Verified', 
          'Documents Submitted', 'Underwriting', 'Loan Approved', 
          'Rejected', 'Disbursed'
        ];
        if (lendingStages.includes(status)) return status;

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

      const matchingTask = tasks.find(t => t.customerId === c.id);
      const stage = matchingTask 
        ? getMappedStatus(matchingTask.id, matchingTask.status) 
        : (numericPart % 2 === 0 ? 'AI Identified' : 'RM Contacted');

      if (stage === 'AI Identified') cntIdentified++;
      else if (stage === 'RM Contacted') cntContacted++;
      else if (stage === 'Income Verified') cntVerified++;
      else if (stage === 'Documents Submitted') cntSubmitted++;
      else if (stage === 'Underwriting') cntUnderwriting++;
      else if (stage === 'Loan Approved') cntApproved++;

      return {
        customer: c,
        leadScore,
        aiConfidence,
        expectedConversion,
        opportunityLakhs,
        opportunityAmount: `₹${opportunityLakhs}L`,
        recommendedProduct: c.segment === 'MSME' ? 'MSME Mortgage Loan' : 'Retail Home Loan',
        nextBestAction: `Schedule retail ${c.segment === 'MSME' ? 'mortgage' : 'home'} loan consultation`
      };
    });

    // Make sure approved count matches high-quality fractions
    cntApproved = cntApproved || Math.max(1, Math.round(highQualityLeadsCount * 0.25));

    const estimatedOpportunityCr = (totalLendingOpportunityLakhs / 100).toFixed(2);
    const averageConfidence = Math.round(confidenceSum / (customers.length || 1)) || 91;
    const conversionProbability = Math.round(conversionSum / (customers.length || 1)) || 84;

    // Pick top 3 highest priority prospects for Today's Action Queue
    const actionQueue = [...scoringCache]
      .sort((a, b) => b.leadScore - a.leadScore)
      .slice(0, 3);

    // AI Recommended actions
    const recommendations = scoringCache.slice(0, 4).map((opp, idx) => {
      if (idx === 0) return `Contact ${opp.customer.name} (Qualified Lead Score: ${opp.leadScore}%)`;
      if (idx === 1) return `Offer ${opp.recommendedProduct} to ${opp.customer.name} (${opp.aiConfidence}% AI Confidence)`;
      if (idx === 2) return `Re-engage Dormant Customer ${opp.customer.name} (${opp.expectedConversion}% Conversion Prob)`;
      return `Verify salary inflow patterns for ${opp.customer.name} (Income verification pending)`;
    });

    // Recent Alerts (Credit Specific)
    const recentAlerts = scoringCache.slice(4, 8).map((opp, idx) => {
      const businessId = getBusinessLeadId(opp.customer.id);
      if (idx === 0) return { title: `Salary Inflow pattern indicates Home Loan eligibility`, desc: `${opp.customer.name} (${businessId}) salary credit validated via FinDNA.`, time: '10m ago' };
      if (idx === 1) return { title: `Repayment capacity limit updated`, desc: `${opp.customer.name} (${businessId}) DTI index fell to 22%.`, time: '1h ago' };
      if (idx === 2) return { title: `Dormant deposit account qualified for secured loan`, desc: `${opp.customer.name} (${businessId}) collateral verification completed.`, time: '3h ago' };
      return { title: `Large recurring credit detected`, desc: `${opp.customer.name} (${businessId}) estimated income adjusted to ₹${(opp.opportunityLakhs * 10).toLocaleString('en-IN')}/mo.`, time: '6h ago' };
    });

    return (
      <div className="space-y-6">
        
        {/* 1. Personalized Greeting */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-semibold text-xs text-gray-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-[#006A4E] tracking-widest block">IDBI Bank Command Desk</span>
            <h1 className="text-base font-bold text-gray-900">Good Morning, {user?.name} 👋</h1>
            <div className="flex items-center space-x-1.5 text-gray-600 text-xs">
              <span>Relationship Manager</span>
              <span>•</span>
              <span className="text-[#006A4E] font-bold">IDBI Mumbai HQ Branch</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-[#6A737D] font-bold uppercase tracking-wider">
            <div>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div className="text-emerald-700 font-bold mt-0.5">Mumbai Branch Active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 2. AI Executive Brief (Left Hero Card) */}
          <div className="lg:col-span-2 bg-[#EAF6F2] border border-[#006A4E]/15 rounded-xl p-5 shadow-sm space-y-4 text-xs font-semibold text-[#00563F]">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#006A4E]" />
              <h2 className="text-sm font-bold text-gray-900">ProspectIQ AI Brief</h2>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-800 font-medium font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-[#006A4E] font-bold">•</span>
                <span><strong>5 new high-quality prospects</strong> detected overnight with lead scores exceeding 85%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006A4E] font-bold">•</span>
                <span><strong>2 retail customers</strong> verified for Home Loan limits based on salary credits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006A4E] font-bold">•</span>
                <span><strong>₹1.9 Cr</strong> new loan sizing opportunity discovered across active branch pipeline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006A4E] font-bold">•</span>
                <span>One customer crossed <strong>95% conversion probability</strong> threshold</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#006A4E] font-bold">•</span>
                <span>AI explainability confidence score today: <strong className="text-[#006A4E]">91% Accuracy</strong></span>
              </li>
            </ul>
          </div>

          {/* 5. AI Recommended Next Actions (Right Card) */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4 text-xs font-semibold">
            <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider flex items-center gap-1.5">
              <CheckCircle className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>AI Recommended Actions</span>
            </h3>
            <div className="space-y-3">
              {recommendations.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                  <span className="text-[#006A4E] mt-0.5"><Check className="h-3.5 w-3.5" /></span>
                  <span className="text-gray-950 font-semibold leading-tight">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Today's KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-xs text-gray-800">
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Qualified Leads</span>
            <strong className="text-lg font-black text-[#006A4E]">{highQualityLeadsCount} Leads</strong>
            <span className="text-[9px] text-[#6A737D] block">Lead Score &gt; 80%</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Expected Conversion</span>
            <strong className="text-lg font-black text-gray-900">{conversionProbability}%</strong>
            <span className="text-[9px] text-emerald-600 block">Exceeds 30% target limit</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Potential Opportunity</span>
            <strong className="text-lg font-black text-[#006A4E]">₹{estimatedOpportunityCr} Cr</strong>
            <span className="text-[9px] text-gray-500 block">Total Portfolio Value</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Today's Meetings</span>
            <strong className="text-lg font-black text-gray-900">4 Meetings</strong>
            <span className="text-[9px] text-[#006A4E] block">Scheduled Adoptions</span>
          </div>
        </div>

        {/* 3. Today's Action Queue */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 font-semibold">
            <Clock className="h-5 w-5 text-[#F58220]" />
            <span>Today's Action Queue (Highest-Priority Leads)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionQueue.map((item, idx) => {
              const borderColors = idx === 0 ? 'border-red-200 bg-red-50/10' : (idx === 1 ? 'border-amber-200 bg-amber-50/10' : 'border-emerald-200 bg-emerald-50/10');
              const dotColors = idx === 0 ? 'bg-red-500' : (idx === 1 ? 'bg-amber-500' : 'bg-emerald-500');
              const statusLabel = idx === 0 ? 'Immediate Action' : (idx === 1 ? 'Pending verification' : 'Ready for meeting');
              const businessId = getBusinessLeadId(item.customer.id);

              return (
                <div
                  key={item.customer.id}
                  onClick={() => { setSelectedCustomer(item.customer); setIsModalOpen(true); }}
                  className={`border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all space-y-3 text-xs font-semibold text-gray-800 ${borderColors}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-1.5 text-[10px] font-bold">
                      <span className={`h-2 w-2 rounded-full ${dotColors}`} />
                      <span>{statusLabel}</span>
                    </span>
                    <span className="text-[9px] text-[#6A737D] font-mono">{businessId}</span>
                  </div>

                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-gray-900 block leading-tight">{item.customer.name}</strong>
                    <span className="text-[10px] text-[#006A4E] block font-bold">{item.recommendedProduct}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px] bg-white border border-[#E5E7EB] p-2 rounded-lg text-gray-700 font-semibold">
                    <div>Lead Score: <strong className="text-gray-950 block">{item.leadScore}%</strong></div>
                    <div>AI Conf: <strong className="text-[#006A4E] block">{item.aiConfidence}%</strong></div>
                    <div>Opportunity: <strong className="text-gray-950 block">{item.opportunityAmount}</strong></div>
                    <div>Conversion: <strong className="text-emerald-700 block">{item.expectedConversion}%</strong></div>
                  </div>

                  <div className="text-[9px] pt-1.5 border-t border-[#E5E7EB] text-gray-600">
                    <span className="text-[#6A737D] uppercase font-bold text-[8px] block tracking-wider">Next Best Action</span>
                    <span className="font-semibold block truncate text-gray-950">{item.nextBestAction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Lending Pipeline Snapshot */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-3.5">
          <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">Lending Pipeline Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { stage: 'AI Identified', count: cntIdentified, bg: 'bg-[#F6F8FA] border-[#E5E7EB]' },
              { stage: 'RM Contacted', count: cntContacted, bg: 'bg-[#EFF6FF] border-blue-200 text-blue-700' },
              { stage: 'Income Verified', count: cntVerified, bg: 'bg-[#FEF3C7] border-amber-200 text-amber-700' },
              { stage: 'Docs Submitted', count: cntSubmitted, bg: 'bg-[#EEF2F6] border-indigo-200 text-indigo-700' },
              { stage: 'Underwriting', count: cntUnderwriting, bg: 'bg-[#FEFCE8] border-yellow-200 text-yellow-700' },
              { stage: 'Loan Approved', count: cntApproved, bg: 'bg-[#ECFDF5] border-emerald-200 text-emerald-700' }
            ].map((item, idx) => (
              <div key={idx} className={`border rounded-lg p-2.5 space-y-1 font-semibold ${item.bg}`}>
                <span className="text-[10px] block uppercase tracking-wider">{item.stage}</span>
                <strong className="text-lg font-black font-mono block">{item.count}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance & Recent AI Discoveries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold text-xs text-gray-800">
          
          {/* 7. Monthly Performance */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">Monthly Performance Indicator</h3>
            <div className="grid grid-cols-2 gap-3.5 text-center">
              <div className="p-3 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                <span className="text-[8px] text-[#6A737D] uppercase block">Conversion Rate</span>
                <strong className="text-sm font-bold text-emerald-700 block mt-0.5">34.2%</strong>
              </div>
              <div className="p-3 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                <span className="text-[8px] text-[#6A737D] uppercase block">Loans Generated</span>
                <strong className="text-sm font-bold text-gray-950 block mt-0.5">12 Loans</strong>
              </div>
              <div className="p-3 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                <span className="text-[8px] text-[#6A737D] uppercase block">Business Value</span>
                <strong className="text-sm font-bold text-[#006A4E] block mt-0.5">₹2.10 Cr</strong>
              </div>
              <div className="p-3 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                <span className="text-[8px] text-[#6A737D] uppercase block">Target Achievement</span>
                <strong className="text-sm font-bold text-[#F58220] block mt-0.5">112%</strong>
              </div>
            </div>
            <div className="p-3 bg-[#EAF6F2] border border-[#006A4E]/10 rounded-lg text-center font-bold text-[#006A4E]">
              Branch Rank: #2 active performance leader
            </div>
          </div>

          {/* 8. Recent AI Discoveries */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-3.5 font-semibold text-gray-800">
            <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">Recent AI Discoveries</h3>
            <div className="space-y-2">
              {[
                'Salary pattern indicates Home Loan eligibility',
                'Repayment capacity estimate updated to 94%',
                'Salary increase detected (+15.2% variance)',
                'Credit utilization score adjusted downwards',
                'Behavioral credit risk reassessed as Low'
              ].map((text, idx) => (
                <div key={idx} className="p-2 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006A4E] flex-shrink-0" />
                  <span className="text-gray-900 font-semibold leading-none">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Recent Alerts */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider flex justify-between items-center">
                <span>Recent Lending Alerts</span>
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              </h3>
              <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} className="border-b border-[#E5E7EB]/70 pb-2 space-y-0.5 font-semibold text-gray-800">
                    <div className="flex justify-between items-center text-[10px]">
                      <strong className="text-gray-950 font-bold leading-tight">{alert.title}</strong>
                      <span className="text-[8px] text-[#6A737D] font-mono">{alert.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-700 leading-tight font-semibold">{alert.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/notifications')}
              className="w-full py-2 bg-[#EAF6F2] hover:bg-[#006A4E] text-[#006A4E] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#006A4E]/15 cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>View All Alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  };

  // ==========================================
  // BRANCH MANAGER DASHBOARD
  // ==========================================
  const renderBmDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-semibold text-xs text-gray-800">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#006A4E] tracking-widest block">Mumbai HQ Branch Center</span>
            <h1 className="text-base font-bold text-gray-900">Branch Overview & Leaderboards</h1>
            <p className="text-xs text-[#6A737D]">Aggregated branch pipeline indicators, RM benchmarks, and conversion metrics.</p>
          </div>
          <div className="h-8 px-3.5 bg-[#EAF6F2] text-[#006A4E] border border-[#006A4E]/15 rounded-lg flex items-center justify-center gap-1.5 font-bold">
            <Landmark className="h-4.5 w-4.5 text-[#006A4E]" />
            <span>Branch Overview (MMB-01)</span>
          </div>
        </div>

        {/* Branch KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-xs text-gray-800">
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Branch Pipeline</span>
            <strong className="text-lg font-black text-gray-900">248 Leads</strong>
            <span className="text-[9px] text-[#006A4E] block">Active Prospects</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Branch Conversion</span>
            <strong className="text-lg font-black text-[#006A4E]">33.2% Rate</strong>
            <span className="text-[9px] text-emerald-600 block">Exceeds 30% Target</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Branch Opportunity</span>
            <strong className="text-lg font-black text-[#006A4E]">₹12.40 Cr</strong>
            <span className="text-[9px] text-gray-500 block">Sized Pipeline</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Branch AI Performance</span>
            <strong className="text-lg font-black text-gray-900">94.1% Accuracy</strong>
            <span className="text-[9px] text-[#006A4E] block">ExplainIQ Audit Delta</span>
          </div>
        </div>

        {/* RM Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold text-xs text-gray-800">
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>RM Leaderboard Benchmarks</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#6A737D] font-bold bg-[#F6F8FA]">
                    <th className="p-3.5">Relationship Manager</th>
                    <th className="p-3.5 text-center">Active Leads</th>
                    <th className="p-3.5 text-center">Conversion Rate</th>
                    <th className="p-3.5 text-center">Sized Opportunity</th>
                    <th className="p-3.5 text-center">SLA Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Priya Sharma</td>
                    <td className="p-3.5 text-center">45 Leads</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">89%</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹4.20 Cr</td>
                    <td className="p-3.5 text-center font-bold text-[#006A4E]">98%</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Anil Verma</td>
                    <td className="p-3.5 text-center">38 Leads</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">84%</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹3.80 Cr</td>
                    <td className="p-3.5 text-center font-bold text-[#006A4E]">96%</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Sunita Iyer</td>
                    <td className="p-3.5 text-center">29 Leads</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">81%</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹2.90 Cr</td>
                    <td className="p-3.5 text-center font-bold text-[#006A4E]">92%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Branch Pipeline Stage Chart */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Branch Pipeline Stage Distribution</span>
            </h3>
            <div className="space-y-2.5">
              {[
                { stage: 'AI Identified', count: 85, color: 'bg-gray-400' },
                { stage: 'RM Contacted', count: 62, color: 'bg-blue-500' },
                { stage: 'Customer Interested', count: 45, color: 'bg-pink-500' },
                { stage: 'Underwriting Assessment', count: 28, color: 'bg-yellow-600' },
                { stage: 'Sanctioned Opportunities', count: 28, color: 'bg-emerald-600' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-700">{item.stage}</span>
                    <span className="text-gray-900">{item.count} Leads</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${item.color}`} 
                      style={{ width: `${(item.count / 248) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // REGIONAL MANAGER DASHBOARD
  // ==========================================
  const renderRegmDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-semibold text-xs text-gray-800">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#006A4E] tracking-widest block">West Zone Regional Operations Command</span>
            <h1 className="text-base font-bold text-gray-900">Regional Overview Dashboard</h1>
            <p className="text-xs text-[#6A737D]">Tracking regional pipelines, loan product mixes, and branch comparisons.</p>
          </div>
          <div className="h-8 px-3.5 bg-[#EAF6F2] text-[#006A4E] border border-[#006A4E]/15 rounded-lg flex items-center justify-center gap-1.5 font-bold">
            <Landmark className="h-4.5 w-4.5 text-[#006A4E]" />
            <span>Zone: Mumbai West (WZO-04)</span>
          </div>
        </div>

        {/* Regional KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-xs text-gray-800">
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">West Zone Leads</span>
            <strong className="text-lg font-black text-gray-900">1,250 Leads</strong>
            <span className="text-[9px] text-[#006A4E] block">Active Regional Prospects</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Zone Qualified Leads</span>
            <strong className="text-lg font-black text-[#006A4E]">415 Qualified</strong>
            <span className="text-[9px] text-emerald-600 block">Lead Score &gt; 80%</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Zone Opportunity</span>
            <strong className="text-lg font-black text-[#006A4E]">₹68.50 Cr</strong>
            <span className="text-[9px] text-gray-500 block">Sized Pipeline</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Zone Conversion Rate</span>
            <strong className="text-lg font-black text-gray-900">34.8%</strong>
            <span className="text-[9px] text-emerald-600 block">Average Conversion</span>
          </div>
        </div>

        {/* Branch Comparisons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold text-xs text-gray-800">
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5 font-semibold">
              <Landmark className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Branch Operational Performance Comparison</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[#6A737D] font-bold bg-[#F6F8FA]">
                    <th className="p-3.5">Branch Name</th>
                    <th className="p-3.5 text-center">Qualified Leads</th>
                    <th className="p-3.5 text-center">Sized Portfolio</th>
                    <th className="p-3.5 text-center">Conversion Rate</th>
                    <th className="p-3.5">Branch Manager</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Mumbai Main Branch</td>
                    <td className="p-3.5 text-center">82 Leads</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹12.40 Cr</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">33.2%</td>
                    <td className="p-3.5 text-gray-700">Sunil Mehta</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Pune City Branch</td>
                    <td className="p-3.5 text-center">65 Leads</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹9.10 Cr</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">31.8%</td>
                    <td className="p-3.5 text-gray-700">K. R. Nair</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Thane Central Branch</td>
                    <td className="p-3.5 text-center">71 Leads</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹10.40 Cr</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">32.1%</td>
                    <td className="p-3.5 text-gray-700">R. P. Patil</td>
                  </tr>
                  <tr className="border-b border-[#E5E7EB] hover:bg-gray-50/50 font-medium">
                    <td className="p-3.5 font-bold text-gray-900">Nagpur Branch</td>
                    <td className="p-3.5 text-center">48 Leads</td>
                    <td className="p-3.5 text-center font-bold text-gray-900">₹6.80 Cr</td>
                    <td className="p-3.5 text-center font-bold text-emerald-600">30.5%</td>
                    <td className="p-3.5 text-gray-700">S. G. Deshmukh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Product Mix Sizing */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Regional Product Mix Sizing</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { product: 'Retail Home Loans', amount: '₹38.20 Cr', percentage: 56, color: 'bg-emerald-600' },
                { product: 'MSME Mortgage Loans', amount: '₹22.50 Cr', percentage: 33, color: 'bg-indigo-600' },
                { product: 'Retail Auto Loans', amount: '₹5.10 Cr', percentage: 7, color: 'bg-blue-500' },
                { product: 'Retail Personal Loans', amount: '₹2.70 Cr', percentage: 4, color: 'bg-gray-400' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-700">{item.product}</span>
                    <span className="text-gray-900">{item.amount} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${item.color}`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // HEAD OFFICE COMMAND CENTER (ADMIN)
  // ==========================================
  const renderHoDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-semibold text-xs text-gray-800">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#006A4E] tracking-widest block">IDBI Bank Head Office Command Center</span>
            <h1 className="text-base font-bold text-gray-900">National Lending Intelligence Center</h1>
            <p className="text-xs text-[#6A737D]">Oversight desk for nationwide retail loan pipelines and ExplainIQ model governance parameters.</p>
          </div>
          <div className="h-8 px-3.5 bg-[#EAF6F2] text-[#006A4E] border border-[#006A4E]/15 rounded-lg flex items-center justify-center gap-1.5 font-bold">
            <Layers className="h-4.5 w-4.5 text-[#006A4E]" />
            <span>National Dashboard</span>
          </div>
        </div>

        {/* Nationwide KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-semibold text-xs text-gray-800">
          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Total Leads</span>
            <strong className="text-lg font-black text-gray-900">12,450 Leads</strong>
            <span className="text-[9px] text-[#6A737D] block">Nationwide Ingested</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Qualified Leads</span>
            <strong className="text-lg font-black text-[#006A4E]">4,180 Qualified</strong>
            <span className="text-[9px] text-emerald-600 block">Lead Score &gt; 80%</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Portfolio Opportunity</span>
            <strong className="text-lg font-black text-[#006A4E]">₹642.80 Cr</strong>
            <span className="text-[9px] text-gray-500 block">Estimated Sizing</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm space-y-1">
            <span className="text-[10px] text-[#6A737D] uppercase tracking-wider block">Expected Conversion</span>
            <strong className="text-lg font-black text-gray-900">35.2%</strong>
            <span className="text-[9px] text-emerald-600 block">National Average</span>
          </div>
        </div>

        {/* AI validation, regional rankings, and product mixes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold text-xs text-gray-800">
          
          {/* AI Accuracy */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>AI Model Accuracy & Performance</span>
            </h3>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-700">Model Gini Index</span>
                <span className="text-[#006A4E] font-mono font-bold">0.84 validation score</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-700">Income Verification Accuracy</span>
                <span className="text-gray-950 font-mono font-bold">94.2% match ratio</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-700">Repayment Capacity Match</span>
                <span className="text-gray-950 font-mono font-bold">92.8% reliability</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-700">Model False Positive Rate</span>
                <span className="text-red-600 font-mono font-bold">3.8% limit (prudent)</span>
              </div>
            </div>
          </div>

          {/* Product Sizing Mix */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5 font-semibold">
              <Layers className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Loan Mix Distribution</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { product: 'Retail Home Loans', amount: '₹308.50 Cr', percentage: 48, color: 'bg-emerald-600' },
                { product: 'MSME Mortgage Loans', amount: '₹205.70 Cr', percentage: 32, color: 'bg-indigo-600' },
                { product: 'Retail Auto Loans', amount: '₹77.10 Cr', percentage: 12, color: 'bg-blue-500' },
                { product: 'Retail Personal Loans', amount: '₹51.50 Cr', percentage: 8, color: 'bg-gray-400' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{item.product}</span>
                    <span className="text-gray-900">{item.amount} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${item.color}`} 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Performance rankings */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5 font-semibold">
              <Landmark className="h-4.5 w-4.5 text-[#006A4E]" />
              <span>Branch Rankings & Executive Insights</span>
            </h3>
            <div className="space-y-3">
              {[
                { zone: 'West Zone (Mumbai HQ)', portfolio: '₹68.5 Cr', conversion: '34.8%' },
                { zone: 'South Zone (Chennai Branch)', portfolio: '₹62.1 Cr', conversion: '33.2%' },
                { zone: 'North Zone (New Delhi Branch)', portfolio: '₹58.9 Cr', conversion: '32.9%' },
                { zone: 'East Zone (Kolkata Branch)', portfolio: '₹41.2 Cr', conversion: '30.8%' }
              ].map((z, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg">
                  <span className="font-bold text-gray-900">#{idx+1} {z.zone}</span>
                  <span className="text-[#006A4E] font-bold font-mono">{z.portfolio} | {z.conversion} Conv</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <Layout>
      {roles.includes('ADMIN') ? renderHoDashboard() :
       roles.includes('REGIONAL_MANAGER') ? renderRegmDashboard() :
       roles.includes('BRANCH_MANAGER') ? renderBmDashboard() :
       renderRmDashboard()}

      {/* Underwriting Modal */}
      <UnderwritingModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }} 
        customer={selectedCustomer} 
      />
    </Layout>
  );
};

const GlobeIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

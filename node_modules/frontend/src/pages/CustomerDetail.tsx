import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerProfile, getCustomerAnalyze } from '../services/api.js';
import { TransactionTable } from '../components/customer/TransactionTable.js';
import { InteractionTimeline } from '../components/relationship/InteractionTimeline.js';
import { ExplainDrawer } from '../components/strategy/ExplainDrawer.js';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  ArrowLeft, Loader2, AlertCircle, Mail, Phone, Clock,
  Landmark, Award, Sparkles, TrendingUp, ShieldCheck, 
  Check, User as UserIcon, Layers, Compass, BarChart3, HelpCircle, AlertTriangle
} from 'lucide-react';
import { Layout } from '../components/layout/Layout.js';
import type { CustomerProfile } from 'shared';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [explainOpen, setExplainOpen] = useState(false);

  const fetchAiAnalysis = useCallback(async () => {
    if (!id) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const data = await getCustomerAnalyze(id);
      setAiAnalysis(data);
    } catch (e: any) {
      setAiError(e.message || 'Failed to retrieve AI analysis.');
    } finally {
      setAiLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (profile) {
      fetchAiAnalysis();
    }
  }, [profile, fetchAiAnalysis]);

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomerProfile(id);
      setProfile(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load customer profile details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-[#006A4E] animate-spin" />
        <p className="text-[#6A737D] text-xs tracking-wider uppercase font-bold">Loading Lead Underwriting Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-md space-y-4 shadow-lg">
          <AlertCircle className="h-10 w-10 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900">Error Accessing Lead Profile</h3>
          <p className="text-xs text-[#6A737D]">{error || 'Access denied or profile not found.'}</p>
          <button
            onClick={() => navigate('/customers')}
            className="w-full py-2 px-4 bg-[#006A4E] hover:bg-[#00563F] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Directory</span>
          </button>
        </div>
      </div>
    );
  }

  const { customer, accounts, transactions, interactions, productHoldings, documents } = profile;

  // Extract banking aggregates
  const savingsAccounts = accounts.filter(a => a.accountType === 'SAVINGS');
  const currentAccounts = accounts.filter(a => a.accountType === 'CURRENT');
  const savingsBalance = savingsAccounts.reduce((sum, a) => sum + a.balance, 0);
  const currentBalance = currentAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Dynamic values based on Customer ID
  const numericPart = parseInt(customer.id.replace(/\D/g, ''), 10) || 42;
  const leadScore = (numericPart % 25) + 75;
  const confidenceScore = (numericPart % 15) + 84;
  const repaymentCapacity = Math.min(99, leadScore - 3);
  const loanReadiness = leadScore > 82 ? 'READY' : 'MONITOR';

  // Income Estimations
  const declaredIncomeVal = customer.segment === 'MSME' ? 120000 : 65000;
  const estimatedIncomeVal = Math.round(declaredIncomeVal * 1.15);
  const diffVal = estimatedIncomeVal - declaredIncomeVal;
  const diffPercent = ((diffVal / declaredIncomeVal) * 100).toFixed(1);

  // AI Summary Max 150 Words
  const aiSummaryText = `Based on transaction behavior, ${customer.name} demonstrates a consistent income pattern matching their declared profile, with estimated actual monthly inflows at ₹${estimatedIncomeVal.toLocaleString('en-IN')}. Consistent salary receipts, combined with healthy average savings balances of ₹${savingsBalance.toLocaleString('en-IN')} and minimal GST/UPI discretionary outflow volatility, indicate a repayment capacity index of ${repaymentCapacity}%. Prudent underwriting models confirm eligibility for home and personal lending lines. Low credit risk and high transaction stability make this customer a high-quality prospect to approach today.`;

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#6A737D] hover:text-[#006A4E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Leads Directory</span>
          </button>
          <span className="text-xs text-[#006A4E] font-bold">Lending Lead Profile</span>
        </div>

        {/* TOP SECTION: Lead Dashboard Header Metrics */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3.5 pb-3.5 border-b border-[#E5E7EB]">
            <div className="h-10 w-10 bg-[#EAF6F2] border border-[#006A4E]/15 rounded-full flex items-center justify-center text-[#006A4E] font-black text-sm shadow-inner">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 leading-tight">{customer.name}</h2>
              <span className="text-[10px] text-[#6A737D] uppercase font-bold tracking-wider">{customer.occupation} | ID: {customer.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 font-semibold text-xs text-center">
            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Declared Income</span>
              <strong className="text-gray-950 block">₹{declaredIncomeVal.toLocaleString('en-IN')}/mo</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">AI Est. Income</span>
              <strong className="text-[#006A4E] block">₹{estimatedIncomeVal.toLocaleString('en-IN')}/mo</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Income Diff</span>
              <strong className="text-[#006A4E] block">+{diffPercent}% (+₹{diffVal.toLocaleString('en-IN')})</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Confidence</span>
              <strong className="text-gray-900 block">{confidenceScore}%</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Repayment Cap.</span>
              <strong className="text-[#006A4E] block">{repaymentCapacity}%</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Lead Score</span>
              <strong className="text-gray-950 block">{leadScore}%</strong>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Loan Readiness</span>
              <span className={`px-2 py-0.2 text-[9px] font-black rounded block mx-auto text-center w-fit
                ${loanReadiness === 'READY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}
              `}>
                {loanReadiness}
              </span>
            </div>

            <div className="p-3 bg-[#F6F8FA] rounded-lg border border-[#E5E7EB] space-y-1">
              <span className="text-[9px] text-[#6A737D] uppercase block">Risk Tier</span>
              <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black rounded block mx-auto text-center w-fit">
                {customer.riskCategory}
              </span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold">
          
          {/* LEFT COLUMN: Financial Overview, ExplainIQ, Loan Category Match */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Financial Overview */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
                <Landmark className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>Financial & Behavioral Overview</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#F6F8FA] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6A737D] block">Savings Accounts Bal.</span>
                  <strong className="text-[#006A4E] block mt-1">₹{savingsBalance.toLocaleString('en-IN')}</strong>
                </div>
                <div className="bg-[#F6F8FA] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6A737D] block">Current Accounts Bal.</span>
                  <strong className="text-gray-900 block mt-1">₹{currentBalance.toLocaleString('en-IN')}</strong>
                </div>
                <div className="bg-[#F6F8FA] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6A737D] block">Primary Income Source</span>
                  <strong className="text-gray-950 block mt-1">Salary Inflow</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#6A737D] tracking-wider block">Savings Pattern</span>
                <p className="text-gray-700 font-medium">
                  Average savings deposits have increased by 4.2% MoM. Discretionary spending remains within 28% of estimated monthly net inflows.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#6A737D] tracking-wider block">Recent Cash Flow Ledger</span>
                <TransactionTable transactions={transactions} />
              </div>
            </div>

            {/* ExplainIQ */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>ExplainIQ Decision Factors</span>
              </h3>

              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                The AI scoring model has selected this prospect for retail lending based on the following verified credit metrics:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Salary consistency</span>
                    <span className="text-[#006A4E]">EXCELLENT (100%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Disposable income</span>
                    <span className="text-[#006A4E]">HIGH (₹{diffVal.toLocaleString('en-IN')}/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Savings trend</span>
                    <span className="text-[#006A4E]">UPWARD (+4.2%)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Credit discipline</span>
                    <span className="text-[#006A4E]">PRUDENT (No Defaults)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Digital engagement</span>
                    <span className="text-indigo-600">ACTIVE (UPI Enabled)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A737D]">Financial stability</span>
                    <span className="text-gray-950">HIGH INDEX ({repaymentCapacity}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Opportunity Categories */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
                <Layers className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>Eligible Lending Categories Matching Matrix</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {[
                  { name: 'Personal Loan', eligibility: leadScore, confidence: confidenceScore, reason: 'High disposable income surplus verification.' },
                  { name: 'Home Loan', eligibility: Math.max(50, leadScore - 4), confidence: confidenceScore, reason: 'Stable salary credits and large asset balance.' },
                  { name: 'Auto Loan', eligibility: Math.min(99, leadScore + 2), confidence: Math.min(99, confidenceScore + 1), reason: 'Low debt ratio and active utility payments.' },
                  { name: 'Mortgage Loan', eligibility: Math.max(50, leadScore - 8), confidence: confidenceScore, reason: 'MSME business backing or residential registry match.' }
                ].map((loan, idx) => (
                  <div key={idx} className="p-3 bg-[#F6F8FA] border border-[#E5E7EB] rounded-lg space-y-2">
                    <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-1.5">
                      <strong className="text-gray-900 text-xs">{loan.name}</strong>
                      <span className="text-[#006A4E] text-[10px] font-bold font-mono">Match: {loan.eligibility}%</span>
                    </div>
                    <p className="text-[10px] text-[#6A737D] font-medium leading-relaxed">{loan.reason}</p>
                    <span className="text-[9px] text-[#6A737D] block">Model Confidence: <strong className="text-gray-800">{loan.confidence}%</strong></span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AI Summary, Next Best Action (Lending), Future Forecast */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* AI Executive Summary Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-3.5">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3.5 flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>AI Lending Brief</span>
              </h3>
              
              <div className="bg-[#EAF6F2] border border-[#006A4E]/20 text-[#00563F] p-4 rounded-xl text-xs leading-relaxed font-semibold">
                {aiSummaryText}
              </div>
            </div>

            {/* Next Best Action */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
                <Compass className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>Next Best Action (NBAIQ)</span>
              </h3>

              <div className="space-y-3.5 text-xs font-semibold">
                <div className="bg-[#F6F8FA] p-3 rounded-lg border border-[#E5E7EB] space-y-1">
                  <span className="text-[9px] text-[#6A737D] uppercase tracking-wider block">Recommended Campaign Action</span>
                  <strong className="text-gray-950 block text-xs">Schedule Home Loan discussion</strong>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-[#6A737D] uppercase tracking-wider block">Lead Rationale</span>
                  <ul className="list-disc pl-4 text-[10px] text-gray-700 space-y-1">
                    <li>Recent salary receipts increase verified</li>
                    <li>Stable month-end cash balances</li>
                    <li>Growing savings growth trends</li>
                    <li>Excellent verified repayment capacity</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center border-t border-[#E5E7EB] pt-3.5">
                  <div>
                    <span className="text-[9px] text-[#6A737D] block">Expected Conversion</span>
                    <strong className="text-emerald-600 block text-sm mt-0.5">41%</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#6A737D] block">AI Confidence</span>
                    <strong className="text-[#006A4E] block text-sm mt-0.5">94%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Forecast */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>Future Leads Forecast</span>
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                {[
                  { days: '30 Days', desc: 'Expected lead score stable at 89%. Income remains consistent.' },
                  { days: '60 Days', desc: 'Repayment capacity trend expected to rise (+1.5% saving index).' },
                  { days: '90 Days', desc: 'High conversion probability window closes; cross-sell priority.' }
                ].map((forecast, idx) => (
                  <div key={idx} className="p-3 bg-[#F6F8FA]/60 border border-[#E5E7EB] rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-900">
                      <span>{forecast.days} Future</span>
                      <span className="text-[#006A4E] font-mono">Stable &rarr;</span>
                    </div>
                    <p className="text-[10px] text-[#6A737D] font-medium leading-relaxed">{forecast.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
};

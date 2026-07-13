import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardList, ShieldCheck, Play, Bell, Calendar, Clock, 
  X, Check, Plus, Search, AlertCircle, RefreshCw, AlertTriangle,
  Loader2, Landmark, Layers, Handshake
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { Layout } from '../components/layout/Layout.js';
import { UnderwritingModal, getBusinessLeadId } from '../components/customer/UnderwritingModal.js';
import { 
  getTaskWorkload, getTaskAnalytics, getTasks, createTask, 
  updateTask, completeTask, addTaskComment, getCustomers,
  RMTask, TaskWorkloadData
} from '../services/api.js';
import type { Customer } from 'shared';

export const RMWorkspace: React.FC = () => {
  const { user } = useAuth();
  
  // Active sub-tab: 'board' | 'calendar' | 'analytics'
  const [activeTab, setActiveTab] = useState<'board' | 'calendar' | 'analytics'>('board');

  // Core Data States
  const [workloadData, setWorkloadData] = useState<TaskWorkloadData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [tasks, setTasks] = useState<RMTask[]>([]);

  // Loaders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Task / Underwriting Modal state
  const [selectedTask, setSelectedTask] = useState<RMTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Opportunity Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskCategory, setTaskCategory] = useState('Opportunity');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskEstDuration, setTaskEstDuration] = useState('30');
  
  // Search Customer State inside create modal
  const [searchCustQuery, setSearchCustQuery] = useState('');
  const [foundCustomers, setFoundCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchingCust, setSearchingCust] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [workloadRes, timesheetRes, tasksRes] = await Promise.all([
        getTaskWorkload(),
        getTaskAnalytics(),
        getTasks()
      ]);
      setWorkloadData(workloadRes);
      setAnalyticsData(timesheetRes);
      setTasks(tasksRes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to sync Retail Lending Pipeline.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Stage mapper for the 8 stages of the Lending pipeline
  const getMappedStatus = (taskId: string, status: string): string => {
    const lendingStages = [
      'AI Identified', 'RM Contacted', 'Income Verified', 
      'Documents Submitted', 'Underwriting', 'Loan Approved', 
      'Rejected', 'Disbursed'
    ];
    if (lendingStages.includes(status)) return status;

    const num = parseInt(taskId.replace(/\D/g, ''), 10) || 0;
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

  const getPriorityBadge = (prio: string) => {
    if (prio === 'HIGH') return 'bg-red-50 border-red-200 text-red-700';
    if (prio === 'MEDIUM') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  // Pipeline columns definition - 8 Lending Pipeline Stages
  const columns = [
    { title: 'AI Identified', status: 'AI Identified', border: 'border-gray-200' },
    { title: 'RM Contacted', status: 'RM Contacted', border: 'border-blue-200' },
    { title: 'Income Verified', status: 'Income Verified', border: 'border-orange-200' },
    { title: 'Documents Submitted', status: 'Documents Submitted', border: 'border-indigo-200' },
    { title: 'Underwriting', status: 'Underwriting', border: 'border-yellow-200' },
    { title: 'Loan Approved', status: 'Loan Approved', border: 'border-emerald-200' },
    { title: 'Rejected', status: 'Rejected', border: 'border-red-200' },
    { title: 'Disbursed', status: 'Disbursed', border: 'border-teal-200' }
  ];

  const handleCustSearch = async () => {
    if (!searchCustQuery.trim()) return;
    setSearchingCust(true);
    try {
      const result = await getCustomers({ page: 1, limit: 10, sort: 'name', order: 'asc', search: searchCustQuery });
      setFoundCustomers(result.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingCust(false);
    }
  };

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate || !selectedCustomer) return;
    setCreatingTask(true);
    try {
      await createTask({
        title: taskTitle,
        description: taskDesc,
        dueDate: new Date(taskDueDate).toISOString(),
        priority: taskPriority as any,
        category: taskCategory as any,
        customerId: selectedCustomer.id
      });
      setTaskTitle('');
      setTaskDesc('');
      setSelectedCustomer(null);
      setShowCreateModal(false);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create opportunity');
    } finally {
      setCreatingTask(false);
    }
  };

  const handleTaskClick = (task: RMTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-[#006A4E] animate-spin" />
        <span className="text-xs text-[#6A737D] font-bold uppercase tracking-wider">Syncing retail lending pipeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 animate-bounce" />
        <h2 className="text-lg font-bold uppercase tracking-wide">Workspace Offline</h2>
        <p className="text-xs text-[#6A737D] max-w-md">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-[#006A4E] hover:bg-[#00563F] text-white text-xs font-bold rounded-lg border border-[#006A4E]/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className="h-4.5 w-4.5" />
          <span>Reload Console</span>
        </button>
      </div>
    );
  }

  // Map backend tasks status dynamically into the 8 pipeline stages
  const mappedTasks = tasks.map(t => ({
    ...t,
    status: getMappedStatus(t.id, t.status)
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Workspace Title & Actions */}
        <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB] font-semibold text-xs text-gray-800">
          <div>
            <h1 className="text-base font-bold text-gray-900">Retail Lending Pipeline</h1>
            <p className="text-[10px] text-[#6A737D] font-bold uppercase tracking-wider mt-0.5">Oversight Workspace for Active Loan Underwritings</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 py-2 px-4 bg-[#006A4E] hover:bg-[#00563F] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm border border-[#006A4E]/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
        
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {columns.map((col, colIdx) => {
            const colTasks = mappedTasks.filter(t => t.status === col.status);
            return (
              <div key={colIdx} className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2 font-semibold text-xs text-gray-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{col.title}</span>
                  <span className="px-2 py-0.5 bg-white border border-[#E5E7EB] rounded-full text-[9px] font-bold font-mono text-[#1F2937]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-4 min-h-[500px] bg-[#F6F8FA]/50 p-2.5 rounded-xl border border-dashed border-[#E5E7EB]">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6A737D] font-medium italic">
                      No active prospects
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const numericPart = parseInt(task.id.replace(/\D/g, ''), 10) || 42;
                      const leadScore = (numericPart % 25) + 75;

                      // Sizing
                      const baseOpportunity = task.customer?.segment === 'MSME' ? 25 : 5;
                      const opportunityLakhs = baseOpportunity + (numericPart % 5) * (task.customer?.segment === 'MSME' ? 6 : 5);
                      const loanSizing = `₹${opportunityLakhs}L`;

                      const leadName = task.customer ? task.customer.name : 'Unknown Prospect';
                      const businessLeadId = task.customer ? getBusinessLeadId(task.customer.id) : 'LD-00042';
                      const recommendedProduct = task.customer?.segment === 'MSME' ? 'MSME Mortgage Loan' : 'Retail Home Loan';
                      const nextAction = `Schedule retail ${recommendedProduct.toLowerCase()} consultation`;
                      const rmName = user?.name || 'Anil Verma';

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className={`bg-white border ${col.border} hover:border-[#006A4E] transition-all rounded-xl p-4 shadow-sm space-y-3 cursor-pointer group`}
                        >
                          <div className="space-y-2 text-xs font-semibold text-gray-800">
                            {/* Lead Name & Business ID */}
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-gray-950 block leading-tight">{leadName}</span>
                                <span className="text-[9px] text-[#6A737D] font-mono leading-none">{businessLeadId}</span>
                              </div>
                              <span className="text-[10px] text-[#006A4E] font-bold block mt-1">{recommendedProduct}</span>
                            </div>

                            {/* Sizing & Lead Score */}
                            <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-700 bg-[#F6F8FA] p-2 rounded-lg border border-[#E5E7EB]">
                              <div>Opportunity Size: <strong className="text-gray-950 block font-bold">{loanSizing}</strong></div>
                              <div>Lead Score: <strong className="text-[#006A4E] block font-bold">{leadScore}%</strong></div>
                            </div>

                            {/* Next Best Action */}
                            <div className="text-[9px] text-gray-600 pt-1.5 border-t border-[#E5E7EB]/70">
                              <span className="text-[#6A737D] uppercase font-bold text-[8px] tracking-wider block">Next Best Action</span>
                              <span className="font-semibold block truncate text-gray-950">{nextAction}</span>
                            </div>

                            {/* Assigned RM */}
                            <div className="text-[8px] text-[#6A737D] pt-1.5 border-t border-[#E5E7EB]/70 flex justify-between items-center">
                              <span>RM: {rmName}</span>
                              <span className={`px-1.5 py-0.2 border text-[8px] font-bold rounded-full ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UNDERWRITING MODAL */}
      <UnderwritingModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }} 
        customer={(selectedTask?.customer as any) || null}
        currentStage={selectedTask?.status}
        onStageChange={async (newStage) => {
          if (!selectedTask) return;
          try {
            const updated = await updateTask(selectedTask.id, { status: newStage });
            setSelectedTask(updated);
            await fetchData();
          } catch (err: any) {
            alert(err.message || 'Failed to update stage');
          }
        }}
      />

      {/* CREATE OPPORTUNITY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-semibold text-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-scale-up-modal">
            
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Plus className="h-4.5 w-4.5 text-[#006A4E]" />
                <span>Create New Lending Opportunity</span>
              </h3>
              <button
                onClick={() => { setShowCreateModal(false); setSelectedCustomer(null); }}
                className="p-1.5 hover:bg-[#F3F4F6] rounded-lg text-gray-400 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs font-semibold text-gray-800">
              {/* Customer search block */}
              <div className="space-y-1.5">
                <label className="text-gray-600 block">Link Customer Profile *</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Type customer name or ID..."
                      value={searchCustQuery}
                      onChange={(e) => setSearchCustQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCustSearch}
                    disabled={searchingCust}
                    className="px-4 py-2 bg-[#EAF6F2] hover:bg-[#006A4E] text-[#006A4E] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#006A4E]/15 cursor-pointer disabled:opacity-50"
                  >
                    {searchingCust ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {foundCustomers.length > 0 && (
                  <div className="p-2 border border-[#E5E7EB] bg-[#F6F8FA] rounded-lg max-h-[120px] overflow-y-auto space-y-1.5">
                    {foundCustomers.map(c => {
                      const businessLeadId = getBusinessLeadId(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => { setSelectedCustomer(c); setFoundCustomers([]); }}
                          className="p-1.5 hover:bg-white rounded border border-transparent hover:border-[#E5E7EB] cursor-pointer flex justify-between items-center text-[10px]"
                        >
                          <span className="font-bold text-gray-900">{c.name}</span>
                          <span className="text-[#6A737D] font-mono">{businessLeadId}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedCustomer && (
                  <div className="p-2.5 bg-[#EAF6F2]/30 border border-[#006A4E]/20 text-[#006A4E] rounded-lg flex justify-between items-center text-[10px] font-bold">
                    <span>Selected: {selectedCustomer.name} ({getBusinessLeadId(selectedCustomer.id)})</span>
                    <button type="button" onClick={() => setSelectedCustomer(null)} className="text-red-600 font-bold">Remove</button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-1">
                <label className="text-gray-600 block">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Retail Home Loan Opportunity"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-600 block">Underwriting Rationale / Comments</label>
                <textarea
                  placeholder="Borrower credit indicators, primary income validation details..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E] min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-600 block">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-600 block">Recommended Loan Product</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                  >
                    <option value="Relationship">Home Loan</option>
                    <option value="Document">Personal Loan</option>
                    <option value="KYC">Auto Loan</option>
                    <option value="Opportunity">Mortgage Loan</option>
                    <option value="Compliance">Business Line of Credit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-600 block">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-600 block">Est. Sizing (Lakhs)</label>
                  <input
                    type="number"
                    value={taskEstDuration}
                    onChange={(e) => setTaskEstDuration(e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#006A4E]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setSelectedCustomer(null); }}
                  className="px-4 py-2 border border-[#E5E7EB] hover:bg-[#F3F4F6] text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="px-4 py-2 bg-[#006A4E] hover:bg-[#00563F] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {creatingTask ? 'Saving Opportunity...' : 'Create Opportunity'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </Layout>
  );
};

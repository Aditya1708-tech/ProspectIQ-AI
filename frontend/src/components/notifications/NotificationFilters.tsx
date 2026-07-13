import React from 'react';

interface NotificationFiltersProps {
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter
}) => {
  const priorities = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['ALL', 'UNREAD', 'READ'];
  
  const categories = [
    'ALL',
    'HIGH_PRIORITY_FOLLOWUP',
    'RELATIONSHIP_REVIEW_DUE',
    'PREDICTION_RISK_ALERT',
    'PORTFOLIO_HEALTH_WARNING',
    'KYC_REMINDER',
    'MISSING_DOCUMENTATION',
    'TASK_OVERDUE',
    'TASK_DUE_TODAY',
    'SLA_BREACH_WARNING',
    'MANAGER_ESCALATION',
    'COMPLIANCE_REMINDER',
    'SYSTEM_INFORMATION'
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Communication Center Filters</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Read Status</label>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer
                  ${statusFilter === s 
                    ? 'bg-indigo-600 border-indigo-500/50 text-white' 
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Severity / Priority</label>
          <div className="flex flex-wrap gap-1.5">
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer
                  ${priorityFilter === p 
                    ? 'bg-indigo-600 border-indigo-500/50 text-white' 
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Category Feed</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 text-xs font-semibold text-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
          >
            {categories.map(c => (
              <option key={c} value={c} className="bg-slate-950 text-slate-300">
                {c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

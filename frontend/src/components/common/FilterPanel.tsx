import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { CustomerStatus } from 'shared';

interface FilterPanelProps {
  status?: CustomerStatus;
  segment?: string;
  riskCategory?: string;
  onStatusChange: (status?: CustomerStatus) => void;
  onSegmentChange: (segment?: string) => void;
  onRiskChange: (risk?: string) => void;
  onClear: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  status,
  segment,
  riskCategory,
  onStatusChange,
  onSegmentChange,
  onRiskChange,
  onClear
}) => {
  const statuses: CustomerStatus[] = ['ACTIVE', 'INACTIVE', 'DORMANT', 'PROSPECT', 'BLACKLISTED'];
  const segments = ['RETAIL', 'MSME'];
  const risks = ['LOW', 'MEDIUM', 'HIGH'];

  const hasFilters = status || segment || riskCategory;

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
      <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <Filter className="h-4 w-4 text-teal-400" />
        <span>Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        {/* Status Filter */}
        <div>
          <select
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
            value={status || ''}
            onChange={(e) => onStatusChange(e.target.value ? (e.target.value as CustomerStatus) : undefined)}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Segment Filter */}
        <div>
          <select
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
            value={segment || ''}
            onChange={(e) => onSegmentChange(e.target.value || undefined)}
          >
            <option value="">All Segments</option>
            {segments.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
        </div>

        {/* Risk Category Filter */}
        <div>
          <select
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-500/60"
            value={riskCategory || ''}
            onChange={(e) => onRiskChange(e.target.value || undefined)}
          >
            <option value="">All Risks</option>
            {risks.map(r => (
              <option key={r} value={r}>{r} Risk</option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center justify-center space-x-1.5 py-2 px-4 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};

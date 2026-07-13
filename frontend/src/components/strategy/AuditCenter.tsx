import React, { useState } from 'react';
import { ShieldCheck, Search, ArrowRightLeft, ArrowLeftRight } from 'lucide-react';
import { AuditLogItem } from '../../services/ai-client.js';

interface AuditCenterProps {
  logs: AuditLogItem[];
}

export const AuditCenter: React.FC<AuditCenterProps> = ({ logs }) => {
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(query.toLowerCase()) ||
    log.action.toLowerCase().includes(query.toLowerCase()) ||
    log.module.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header and search bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-white/5 gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Compliance Audit Center</h4>
            <p className="text-[9px] text-slate-500 font-medium block mt-0.5">Filterable access and operational log events</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by action/user..."
            value={query}
            onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-950/60 border border-white/5 hover:border-indigo-500/20 text-white pl-9 pr-4 py-2 text-[10px] font-semibold rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-2.5">Timestamp</th>
              <th className="py-2.5">Operator</th>
              <th className="py-2.5">Action</th>
              <th className="py-2.5">Module</th>
              <th className="py-2.5 text-right">Trace ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedLogs.map((log, idx) => (
              <tr key={idx} className="text-[10px] font-medium text-slate-300 hover:bg-slate-950/10 transition-colors duration-150">
                <td className="py-3 font-mono text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-3">
                  <div className="space-y-0.5">
                    <span className="text-white font-bold block">{log.user}</span>
                    <span className="text-[8px] text-indigo-400 font-black uppercase tracking-wider block font-mono">{log.role}</span>
                  </div>
                </td>
                <td className="py-3 font-semibold text-slate-200">{log.action}</td>
                <td className="py-3 text-slate-400">{log.module}</td>
                <td className="py-3 text-right font-mono text-slate-500 font-semibold">{log.traceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <span className="text-[9px] text-slate-500 font-bold uppercase">
          Showing {paginatedLogs.length} of {filteredLogs.length} Logs
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 bg-slate-950 border border-white/5 rounded-lg text-slate-400 disabled:opacity-35 cursor-pointer hover:border-indigo-500/30 transition-colors"
          >
            Previous
          </button>
          <span className="text-[10px] font-mono font-bold text-white px-2.5">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 bg-slate-950 border border-white/5 rounded-lg text-slate-400 disabled:opacity-35 cursor-pointer hover:border-indigo-500/30 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

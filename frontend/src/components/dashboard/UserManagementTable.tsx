import React from 'react';
import { Users, User, ArrowUpRight } from 'lucide-react';
import { UserProductivity } from '../../services/ai-client.js';

interface UserManagementTableProps {
  users: UserProductivity[];
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users }) => {
  const getScoreStyle = (score: number) => {
    if (score >= 90) return 'text-emerald-400 font-bold';
    if (score >= 70) return 'text-indigo-400 font-bold';
    return 'text-rose-400 font-bold';
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Users className="h-4.5 w-4.5 text-indigo-400" />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Productivity Management</h4>
          <p className="text-[9px] text-slate-500 font-medium block mt-0.5">Read-only personnel registry audit logs</p>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-2.5">User Context</th>
              <th className="py-2.5">Branch</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5">Last Session</th>
              <th className="py-2.5">Assigned Customers / Tasks</th>
              <th className="py-2.5 text-right">Productivity index</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u, idx) => (
              <tr key={idx} className="text-[10px] font-medium text-slate-300 hover:bg-slate-950/10 transition-colors duration-150">
                <td className="py-3 flex items-center space-x-2">
                  <span className="p-1 bg-slate-950 border border-white/5 rounded-lg block">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                  </span>
                  <div>
                    <span className="text-white font-bold block">{u.username}</span>
                    <span className="text-[8px] text-slate-500 font-black uppercase block tracking-wider font-mono">{u.role}</span>
                  </div>
                </td>
                <td className="py-3 font-mono text-slate-400">{u.branch}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 border rounded-full text-[8px] font-black uppercase tracking-wider ${
                    u.status === 'ACTIVE' 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-slate-500 bg-slate-950 border-white/5'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 font-mono text-slate-500">
                  {new Date(u.lastLogin).toLocaleDateString([], { month: 'short', day: '2-digit' })}{' '}
                  {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3 font-mono text-slate-400">
                  {u.assignedCustomers} Cust / {u.assignedTasks} Tasks
                </td>
                <td className="py-3 text-right font-mono font-bold">
                  <span className={getScoreStyle(u.productivityScore)}>{u.productivityScore}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

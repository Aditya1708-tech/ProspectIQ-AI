import React from 'react';
import { Mail, Phone, UserCheck, ArrowRight } from 'lucide-react';
import type { Customer } from 'shared';

interface CustomerCardProps {
  customer: Customer & { rm?: { name: string; username: string } };
  onClick: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  const getRiskColor = (risk: string) => {
    if (risk === 'LOW') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (risk === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-red-500/10 text-red-400 border-red-500/30';
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    if (status === 'INACTIVE' || status === 'DORMANT') return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    if (status === 'PROSPECT') return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    return 'bg-red-500/10 text-red-500 border-red-500/30';
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-900/30 hover:bg-slate-900/60 border border-white/5 hover:border-teal-500/30 rounded-2xl p-6 transition-all duration-300 shadow-lg cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-teal-400 transition-colors">
              {customer.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{customer.occupation}</p>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold ${getRiskColor(customer.riskCategory)}`}>
              {customer.riskCategory}
            </span>
            <span className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-4 mb-4">
          {customer.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              <span>{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <UserCheck className="h-3.5 w-3.5 text-slate-500" />
            <span>Assigned RM: <span className="text-slate-300">{customer.rm?.name || 'Unassigned'}</span></span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs border-t border-white/5 pt-4">
        <span className="text-slate-500 font-medium">Segment: <span className="text-slate-300 font-semibold">{customer.segment}</span></span>
        <div className="flex items-center space-x-1 text-teal-400 font-semibold group-hover:translate-x-1 transition-transform">
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

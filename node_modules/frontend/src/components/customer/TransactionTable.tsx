import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Transaction } from 'shared';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-slate-900/10 border border-white/5 rounded-2xl p-8 text-center text-slate-400 text-sm leading-relaxed">
        No transaction records found for this client.
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">Value Date</th>
              <th className="py-3.5 px-6">Description</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Reference</th>
              <th className="py-3.5 px-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200 text-xs">
            {transactions.map(t => {
              const isCredit = t.type === 'CREDIT';
              return (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap text-slate-400">
                    {formatDate(t.valueDate)}
                  </td>
                  <td className="py-4 px-6 font-medium max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 bg-slate-800 border border-white/5 rounded-md text-[10px] text-slate-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                    {t.reference || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 font-bold ${isCredit ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3 text-slate-400" />
                      )}
                      <span>
                        {isCredit ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

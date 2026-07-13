import React from 'react';
import type { EvidenceItem } from '../../services/api.js';

interface EvidenceTableProps {
  evidence: EvidenceItem[];
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({ evidence }) => {
  return (
    <div className="space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Decision Evidence Matrix</span>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              <th className="py-2.5 px-3">Evidence Item</th>
              <th className="py-2.5 px-3">Engine</th>
              <th className="py-2.5 px-3 text-center">Contribution</th>
              <th className="py-2.5 px-3 text-center">Weight</th>
              <th className="py-2.5 px-3 text-right">Source Registry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px] text-slate-300">
            {evidence.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30">
                <td className="py-3 px-3 font-bold text-white flex flex-col">
                  <span>{item.evidenceName}</span>
                  <span className={`text-[8px] font-black uppercase mt-0.5
                    ${item.status === 'Positive' ? 'text-emerald-400' : 'text-rose-400'}
                  `}>
                    {item.status} Impact
                  </span>
                </td>
                <td className="py-3 px-3 font-medium">{item.engine}</td>
                <td className={`py-3 px-3 text-center font-mono font-bold
                  ${item.status === 'Positive' ? 'text-emerald-400' : 'text-rose-400'}
                `}>
                  {item.contribution}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded text-[9px] font-bold text-slate-400 uppercase">
                    {item.confidenceWeight}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-semibold text-slate-500">{item.evidenceSource}</td>
              </tr>
            ))}
            {evidence.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                  No evidence parameters registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

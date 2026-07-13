import React from 'react';
import { ArrowDown, CheckCircle, Clock } from 'lucide-react';
import type { DecisionTreeNode } from '../../services/api.js';

interface DecisionTreeProps {
  nodes: DecisionTreeNode[];
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ nodes }) => {
  return (
    <div className="space-y-4 py-2">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">AI Decision Pipeline Flow</span>
      
      <div className="relative pl-6 border-l border-indigo-500/20 space-y-6">
        {nodes.map((node, idx) => (
          <div key={idx} className="relative group">
            {/* Step marker */}
            <div className="absolute -left-[31px] top-1.5 p-1 bg-slate-900 border-2 border-indigo-500 rounded-full z-10 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-indigo-400" />
            </div>

            <div className="bg-slate-950/60 border border-white/5 group-hover:border-indigo-500/20 rounded-2xl p-4 transition-all space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-black text-white uppercase tracking-wide group-hover:text-indigo-400 transition-colors">
                  {node.title}
                </h4>
                <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span>{node.executionLatencyMs.toFixed(2)}ms</span>
                </span>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {node.summary}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 text-[9px] text-slate-500">
                <div>
                  <span className="block font-bold uppercase text-slate-600">Inputs:</span>
                  <span className="font-mono text-slate-400">{node.inputReferences.join(', ')}</span>
                </div>
                <div>
                  <span className="block font-bold uppercase text-slate-600">Outputs:</span>
                  <span className="font-mono text-indigo-300 font-semibold">{node.outputReferences.join(', ')}</span>
                </div>
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div className="absolute left-[-26px] bottom-[-24px] pointer-events-none opacity-40">
                <ArrowDown className="h-4 w-4 text-indigo-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

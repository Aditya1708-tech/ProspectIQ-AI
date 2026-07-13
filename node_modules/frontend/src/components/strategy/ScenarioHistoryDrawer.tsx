import React from 'react';
import { X, Clock, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ScenarioHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: any[];
}

export const ScenarioHistoryDrawer: React.FC<ScenarioHistoryDrawerProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-slate-950/97 border-l border-white/5 shadow-2xl flex flex-col justify-between h-full transform transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
              SimulationIQ Logs
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-400" />
              <span>Scenario Run History</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-2">
              <HelpCircle className="h-8 w-8 text-indigo-500/30" />
              <p className="text-xs font-semibold max-w-[200px] leading-relaxed">
                No custom simulation runs logged for this customer during the active session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((log, idx) => {
                const healthDiff = log.metricsDiff.relationshipHealth || 0;
                const isHealthPositive = healthDiff >= 0;
                
                return (
                  <div key={idx} className="bg-slate-900/30 border border-white/5 hover:border-white/10 rounded-2xl p-4 space-y-3 transition-colors duration-150">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white leading-tight">{log.scenarioName}</h4>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded-lg text-[8px] font-black text-white uppercase tracking-wider font-mono">
                        {log.decisionCategory}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {log.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>Health delta:</span>
                      <span className={`font-mono font-black flex items-center gap-0.5 ${isHealthPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isHealthPositive ? '+' : ''}{healthDiff}%
                        {isHealthPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      </span>
                      <span>Confidence:</span>
                      <span className="text-white font-mono">{log.overallConfidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Active Session Logs:</span>
          <span className="text-white font-mono">{history.length} Runs</span>
        </div>
      </div>
    </div>
  );
};

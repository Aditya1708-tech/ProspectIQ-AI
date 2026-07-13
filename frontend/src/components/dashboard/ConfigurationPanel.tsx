import React from 'react';
import { Settings, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { ConfigSettings } from '../../services/ai-client.js';

interface ConfigurationPanelProps {
  config: ConfigSettings;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="h-4.5 w-4.5 text-indigo-400" />
          <span>Governance Configuration</span>
        </span>
        <span className="px-2.5 py-0.5 bg-slate-950 border border-white/5 rounded-xl text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          Read-Only Demo Mode
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Sliders thresholds */}
        <div className="space-y-4">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">AI Threshold Limits</span>
          
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Confidence Threshold</span>
              <span className="font-mono text-white">{config.aiConfidenceThreshold}%</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${config.aiConfidenceThreshold}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Priority Action Threshold</span>
              <span className="font-mono text-white">{config.priorityThreshold}%</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${config.priorityThreshold}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Relationship Health Standard</span>
              <span className="font-mono text-white">{config.relationshipThreshold}%</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${config.relationshipThreshold}%` }} />
            </div>
          </div>
        </div>

        {/* Feature Flags / Toggles */}
        <div className="space-y-3.5">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Core Feature Flags</span>

          {Object.entries(config.featureFlags).map(([flag, val]) => (
            <div key={flag} className="flex justify-between items-center bg-slate-950/20 border border-white/5 rounded-xl px-3 py-2 text-[10px]">
              <span className="text-slate-400 font-semibold">{flag}</span>
              <div className="flex items-center space-x-1.5">
                {val ? (
                  <>
                    <span className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider">Active</span>
                    <ToggleRight className="h-4.5 w-4.5 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Inactive</span>
                    <ToggleLeft className="h-4.5 w-4.5 text-slate-600" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

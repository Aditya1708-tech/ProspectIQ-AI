import React from 'react';
import { ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { ScenarioAdjustment } from '../../services/ai-client.js';

interface SimulationControlPanelProps {
  adjustments: ScenarioAdjustment;
  onChange: (adj: ScenarioAdjustment) => void;
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({ adjustments, onChange }) => {
  
  const handleSliderChange = (field: keyof ScenarioAdjustment, value: number) => {
    onChange({
      ...adjustments,
      [field]: value
    });
  };

  const handleToggleChange = (field: keyof ScenarioAdjustment, currentValue: boolean | null) => {
    // Cycles: null -> true -> false -> null
    let nextValue: boolean | null = null;
    if (currentValue === null) nextValue = true;
    else if (currentValue === true) nextValue = false;
    else nextValue = null;

    onChange({
      ...adjustments,
      [field]: nextValue
    });
  };

  const getToggleLabel = (value: boolean | null, trueLabel: string, falseLabel: string) => {
    if (value === true) return { text: trueLabel, style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (value === false) return { text: falseLabel, style: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    return { text: 'Baseline (No Change)', style: 'text-slate-500 bg-slate-950 border-white/5' };
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
        <Settings className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Adjustment Parameters</h4>
      </div>

      <div className="space-y-5">
        {/* Slider outreach */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">Outreach Frequency</span>
            <span className="text-indigo-400 font-mono">{adjustments.rmInteractionsChange > 0 ? '+' : ''}{adjustments.rmInteractionsChange}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="150"
            step="10"
            value={adjustments.rmInteractionsChange}
            onChange={e => handleSliderChange('rmInteractionsChange', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
          />
        </div>

        {/* Slider savings */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">Savings Deposit Velocity</span>
            <span className="text-indigo-400 font-mono">{adjustments.savingsRatioChange > 0 ? '+' : ''}{adjustments.savingsRatioChange}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="150"
            step="10"
            value={adjustments.savingsRatioChange}
            onChange={e => handleSliderChange('savingsRatioChange', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
          />
        </div>

        {/* Slider digital */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">Digital Payments Volume</span>
            <span className="text-indigo-400 font-mono">{adjustments.digitalPaymentsChange > 0 ? '+' : ''}{adjustments.digitalPaymentsChange}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="150"
            step="10"
            value={adjustments.digitalPaymentsChange}
            onChange={e => handleSliderChange('digitalPaymentsChange', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
          />
        </div>

        {/* Slider engagement */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">Telemetry Engagement Index</span>
            <span className="text-indigo-400 font-mono">{adjustments.engagementChange > 0 ? '+' : ''}{adjustments.engagementChange}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="150"
            step="10"
            value={adjustments.engagementChange}
            onChange={e => handleSliderChange('engagementChange', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
          />
        </div>

        {/* Toggle KYC Event */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">KYC Compliance Check</span>
            <button
              onClick={() => handleToggleChange('kycEvent', adjustments.kycEvent)}
              className={`px-3 py-1 border rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
                getToggleLabel(adjustments.kycEvent, 'Complete KYC', 'Delay KYC').style
              }`}
            >
              {getToggleLabel(adjustments.kycEvent, 'Complete KYC', 'Delay KYC').text}
            </button>
          </div>

          {/* Toggle Close Pending Tasks */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RM CRM Backlog Tasks</span>
            <button
              onClick={() => handleToggleChange('closePendingTasks', adjustments.closePendingTasks)}
              className={`px-3 py-1 border rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
                getToggleLabel(adjustments.closePendingTasks, 'Close Backlog', 'Leave Overdue').style
              }`}
            >
              {getToggleLabel(adjustments.closePendingTasks, 'Close Backlog', 'Leave Overdue').text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, RefreshCw, Zap, ShieldCheck, Heart } from 'lucide-react';
import { SimulationScenario } from '../../services/ai-client.js';

interface ScenarioTemplatesProps {
  onSelect: (scenario: SimulationScenario) => void;
}

export const ScenarioTemplates: React.FC<ScenarioTemplatesProps> = ({ onSelect }) => {
  const templates = [
    {
      id: "boost_outreach",
      name: "Outreach Boost",
      desc: "Increase RM interactions by 50% & follow-up by 25%.",
      icon: <Zap className="h-4.5 w-4.5 text-indigo-400" />,
      adjustments: {
        rmInteractionsChange: 50.0,
        kycEvent: null,
        savingsRatioChange: 0.0,
        digitalPaymentsChange: 15.0,
        salaryStabilityChange: 0.0,
        meetingCompletionChange: 20.0,
        followUpQualityChange: 25.0,
        engagementChange: 30.0,
        closePendingTasks: true
      }
    },
    {
      id: "kyc_recovery",
      name: "KYC & Compliance",
      desc: "Perform KYC update and close all overdue task backlogs.",
      icon: <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />,
      adjustments: {
        rmInteractionsChange: 20.0,
        kycEvent: true,
        savingsRatioChange: 0.0,
        digitalPaymentsChange: 0.0,
        salaryStabilityChange: 0.0,
        meetingCompletionChange: 10.0,
        followUpQualityChange: 10.0,
        engagementChange: 15.0,
        closePendingTasks: true
      }
    },
    {
      id: "savings_optimization",
      name: "Deposit Accelerator",
      desc: "Raise client savings deposits velocity by 40%.",
      icon: <Sparkles className="h-4.5 w-4.5 text-amber-400" />,
      adjustments: {
        rmInteractionsChange: 10.0,
        kycEvent: null,
        savingsRatioChange: 40.0,
        digitalPaymentsChange: 20.0,
        salaryStabilityChange: 10.0,
        meetingCompletionChange: 15.0,
        followUpQualityChange: 15.0,
        engagementChange: 20.0,
        closePendingTasks: null
      }
    },
    {
      id: "dormancy_prevention",
      name: "Dormancy Mitigation",
      desc: "Initiate emergency KYC recovery and max communications.",
      icon: <Heart className="h-4.5 w-4.5 text-rose-400" />,
      adjustments: {
        rmInteractionsChange: 80.0,
        kycEvent: true,
        savingsRatioChange: 15.0,
        digitalPaymentsChange: 30.0,
        salaryStabilityChange: 0.0,
        meetingCompletionChange: 50.0,
        followUpQualityChange: 30.0,
        engagementChange: 60.0,
        closePendingTasks: true
      }
    }
  ];

  return (
    <div className="space-y-3">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Quick Presets Templates</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map(tpl => (
          <button
            key={tpl.id}
            onClick={() => onSelect({
              scenarioName: tpl.name,
              description: tpl.desc,
              adjustments: tpl.adjustments
            })}
            className="text-left bg-slate-950/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:translate-y-[-2px] space-y-2 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start w-full">
              <span className="p-1.5 bg-slate-900 border border-white/5 rounded-xl block">
                {tpl.icon}
              </span>
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-white leading-snug">{tpl.name}</h5>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{tpl.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

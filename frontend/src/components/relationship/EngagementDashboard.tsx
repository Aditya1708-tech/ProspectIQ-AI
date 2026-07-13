import React from 'react';
import { Activity, CheckCircle, Zap, Users, CalendarDays, Flame } from 'lucide-react';

interface EngagementMetrics {
  interactionScore: number;
  followUpQuality: number;
  responseConsistency: number;
  rmCoverage: number;
  meetingCompletion: number;
  touchpointFrequency: number;
}

interface EngagementDashboardProps {
  engagement: EngagementMetrics;
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({ engagement }) => {
  const {
    interactionScore,
    followUpQuality,
    responseConsistency,
    rmCoverage,
    meetingCompletion,
    touchpointFrequency
  } = engagement;

  // SVG Ring calculation for Main Score
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (interactionScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBarBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const metricCards = [
    {
      label: 'Follow-up Quality',
      value: followUpQuality,
      icon: <CheckCircle className="h-4 w-4" />,
      color: getScoreColor(followUpQuality),
      bg: getScoreBarBg(followUpQuality),
      desc: 'Completion rate of follow-up tasks against relationship commitments.'
    },
    {
      label: 'Response Consistency',
      value: responseConsistency,
      icon: <Zap className="h-4 w-4" />,
      color: getScoreColor(responseConsistency),
      bg: getScoreBarBg(responseConsistency),
      desc: 'On-time completion rate of assigned client tasks within SLA window.'
    },
    {
      label: 'RM Coverage',
      value: rmCoverage,
      icon: <Users className="h-4 w-4" />,
      color: getScoreColor(rmCoverage),
      bg: getScoreBarBg(rmCoverage),
      desc: 'Density of touchpoints logged by the assigned Relationship Manager.'
    },
    {
      label: 'Meeting Completion',
      value: meetingCompletion,
      icon: <CalendarDays className="h-4 w-4" />,
      color: getScoreColor(meetingCompletion),
      bg: getScoreBarBg(meetingCompletion),
      desc: 'Proportion of scheduled meetings successfully completed.'
    }
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/5 flex items-center space-x-2.5">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
          <Activity className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Engagement Analytics (EngagementIQ)</h4>
          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Telemetry metrics measuring communication density and reliability</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interaction Score Gauge */}
        <div className="lg:col-span-1 bg-slate-950/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Relationship Interaction Score</span>
          
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.03)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#engagementGrad)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="engagementGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-white">{interactionScore.toFixed(0)}%</span>
              <span className="text-[8px] block font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Score</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400">
            <Flame className="h-4 w-4 text-orange-400 animate-pulse" />
            <span>Monthly touchpoint frequency: <strong className="text-white">{touchpointFrequency.toFixed(1)}/mo</strong></span>
          </div>
        </div>

        {/* Right Columns: Metrics details */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metricCards.map((card, idx) => (
            <div key={idx} className="bg-slate-950/20 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors duration-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className={card.color}>{card.icon}</span>
                  <span>{card.label}</span>
                </span>
                <span className={`text-sm font-black ${card.color}`}>{card.value.toFixed(0)}%</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full ${card.bg} rounded-full transition-all duration-1000`}
                    style={{ width: `${card.value}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

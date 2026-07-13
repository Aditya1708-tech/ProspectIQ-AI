import React from 'react';

interface NotificationBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ priority }) => {
  const getStyle = () => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'HIGH':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'MEDIUM':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'LOW':
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider ${getStyle()}`}>
      {priority}
    </span>
  );
};

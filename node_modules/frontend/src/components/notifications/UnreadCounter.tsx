import React from 'react';

interface UnreadCounterProps {
  count: number;
  className?: string;
}

export const UnreadCounter: React.FC<UnreadCounterProps> = ({ count, className = '' }) => {
  if (count <= 0) return null;

  return (
    <span 
      className={`inline-flex items-center justify-center px-1.5 py-0.5 ml-1.5 text-[9px] font-black leading-none text-rose-100 bg-rose-500 rounded-full border border-rose-400/30 animate-pulse ${className}`}
      id="unread-notifications-count-badge"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

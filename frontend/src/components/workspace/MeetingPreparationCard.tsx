import React from 'react';
import { MessageSquare, ClipboardCheck } from 'lucide-react';
import type { NBAIQCustomerTaskCard } from '../../services/api.js';

interface MeetingPreparationCardProps {
  taskCard: NBAIQCustomerTaskCard;
}

export const MeetingPreparationCard: React.FC<MeetingPreparationCardProps> = ({ taskCard }) => {
  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Meeting Cues & Preparation</span>
      
      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
        {/* Core preparation notes */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Preparation Guide</span>
          </span>
          <div className="space-y-1.5">
            {taskCard.preparationNotes.map((note: string, idx: number) => (
              <p key={idx} className="text-xs text-slate-300 leading-relaxed font-semibold">
                • {note}
              </p>
            ))}
          </div>
        </div>

        {/* Verbal starers */}
        {taskCard.talkingPoints && taskCard.talkingPoints.length > 0 && (
          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
              <span>Verbal Openers</span>
            </span>
            <div className="space-y-2">
              {taskCard.talkingPoints.map((starter: string, idx: number) => (
                <div key={idx} className="p-2.5 bg-slate-900/30 border border-white/5 rounded-xl text-xs font-medium italic text-slate-300">
                  "{starter}"
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

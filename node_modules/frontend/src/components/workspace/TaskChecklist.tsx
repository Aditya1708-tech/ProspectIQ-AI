import React, { useState } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronUp, CheckCircle, MessagesSquare, Lightbulb } from 'lucide-react';
import type { NBAIQCustomerTaskCard } from '../../services/api.js';

interface TaskChecklistProps {
  taskCard: NBAIQCustomerTaskCard;
  checklist: string[];
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ taskCard, checklist }) => {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleItem = (idx: number) => {
    setCompletedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <CheckSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{taskCard.headline}</h4>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">{taskCard.summary}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Interactive Checklist (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">RM Action Items Checklist</span>
            
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-2.5">
              {checklist.map((item, idx) => {
                const isDone = !!completedItems[idx];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleItem(idx)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none
                      ${isDone 
                        ? 'bg-teal-950/10 border-teal-500/20 text-slate-500' 
                        : 'bg-slate-900/20 border-white/5 hover:border-white/10 text-slate-300'
                      }`}
                  >
                    <button className="mt-0.5 text-teal-400 flex-shrink-0">
                      {isDone 
                        ? <CheckSquare className="h-4.5 w-4.5 text-teal-400 transition-transform scale-110 duration-200" /> 
                        : <Square className="h-4.5 w-4.5 text-slate-500 hover:text-slate-400" />
                      }
                    </button>
                    <span className={`text-xs font-semibold leading-tight ${isDone ? 'line-through decoration-slate-600' : ''}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Success Criteria */}
            <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-2xl p-4 flex items-start space-x-3">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Success Criteria</span>
                <p className="text-xs text-emerald-300/80 font-medium leading-relaxed mt-1">
                  {taskCard.successCriteria}
                </p>
              </div>
            </div>
          </div>

          {/* Talking Points & Prep (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Talking Points */}
            {taskCard.talkingPoints && taskCard.talkingPoints.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
                  <MessagesSquare className="h-3.5 w-3.5 text-teal-400" />
                  <span>Relationship Conversation Guide</span>
                </span>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3">
                  {taskCard.talkingPoints.map((point: string, idx: number) => (
                    <div key={idx} className="text-xs text-slate-300 leading-normal p-2.5 bg-slate-900/30 border border-white/5 rounded-xl font-medium flex gap-2">
                      <span className="font-bold text-teal-400">P{idx + 1}.</span>
                      <span>"{point}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Notes */}
            {taskCard.preparationNotes && taskCard.preparationNotes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  <span>Preparation Notes</span>
                </span>
                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-2.5">
                  {taskCard.preparationNotes.map((note: string, idx: number) => (
                    <div key={idx} className="text-[11px] text-slate-400 leading-relaxed font-semibold flex gap-2 items-start">
                      <span className="h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0 w-1"></span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

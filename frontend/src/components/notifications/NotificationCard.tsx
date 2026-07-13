import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, FileText, CheckCircle2, UserCheck, Calendar, Server, 
  Clock, ArrowRight, Eye, CheckCircle, ShieldAlert
} from 'lucide-react';
import { NotificationBadge } from './NotificationBadge.js';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  channel: string[];
  createdTime: string;
  expiryTime: string;
  assignedRM: string;
  assignedManager: string;
  readStatus: boolean;
  acknowledgedStatus: boolean;
  escalationLevel: number;
  workflowLink: string;
  confidence: number;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onRead: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onClickCard?: (notif: NotificationItem) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onRead,
  onAcknowledge,
  onClickCard
}) => {
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    const cat = notification.category.toUpperCase();
    if (cat.includes('RISK') || cat.includes('BREACH')) return <AlertTriangle className="h-4 w-4 text-rose-400" />;
    if (cat.includes('KYC') || cat.includes('DOCUMENT')) return <FileText className="h-4 w-4 text-teal-400" />;
    if (cat.includes('TASK') || cat.includes('DUE')) return <CheckCircle2 className="h-4 w-4 text-indigo-400" />;
    if (cat.includes('REVIEW') || cat.includes('FOLLOWUP')) return <UserCheck className="h-4 w-4 text-amber-400" />;
    if (cat.includes('BIRTHDAY') || cat.includes('ANNIVERSARY')) return <Calendar className="h-4 w-4 text-pink-400" />;
    if (cat.includes('SYSTEM') || cat.includes('BRANCH')) return <Server className="h-4 w-4 text-blue-400" />;
    return <ShieldAlert className="h-4 w-4 text-slate-400" />;
  };

  const getPriorityGlow = () => {
    switch (notification.priority.toUpperCase()) {
      case 'CRITICAL':
        return 'border-l-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.15)] bg-gradient-to-r from-rose-950/20 to-slate-900/40';
      case 'HIGH':
        return 'border-l-amber-500 shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)] bg-gradient-to-r from-amber-950/10 to-slate-900/40';
      case 'MEDIUM':
        return 'border-l-indigo-500';
      case 'LOW':
      default:
        return 'border-l-slate-600';
    }
  };

  const formattedDate = new Date(notification.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
    ' ' + new Date(notification.createdTime).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div 
      className={`relative group bg-slate-950/60 hover:bg-slate-900/60 border border-white/5 border-l-4 rounded-2xl p-5 space-y-4 transition-all duration-300 ${getPriorityGlow()} ${
        !notification.readStatus ? 'border-r border-r-indigo-500/30' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notification.readStatus && (
        <span className="absolute top-4 right-4 h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start">
        <div 
          className="flex items-center space-x-3.5 cursor-pointer"
          onClick={() => onClickCard && onClickCard(notification)}
        >
          <div className="p-2 bg-slate-900/80 border border-white/10 rounded-xl">
            {getCategoryIcon()}
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
              {notification.category.replace(/_/g, ' ')}
            </span>
            <h3 className={`text-xs font-bold text-white group-hover:text-indigo-300 transition-colors ${
              !notification.readStatus ? 'font-black' : ''
            }`}>
              {notification.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <NotificationBadge priority={notification.priority} />
        </div>
      </div>

      {/* Description */}
      <p 
        className="text-xs text-slate-400 leading-relaxed font-semibold cursor-pointer"
        onClick={() => onClickCard && onClickCard(notification)}
      >
        {notification.description}
      </p>

      {/* Card Footer Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[10px] text-slate-500">
        <div className="flex items-center space-x-1 font-mono">
          <Clock className="h-3 w-3 text-slate-500" />
          <span>{formattedDate}</span>
          <span className="text-slate-700">|</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase">Confidence: {(notification.confidence * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Read button */}
          {!notification.readStatus && (
            <button
              onClick={() => onRead(notification.id)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-white/5 font-bold cursor-pointer transition-colors"
              title="Mark as Read"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Read</span>
            </button>
          )}

          {/* Acknowledge button */}
          {!notification.acknowledgedStatus && (notification.priority === 'CRITICAL' || notification.priority === 'HIGH') && (
            <button
              onClick={() => onAcknowledge(notification.id)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 font-bold rounded-lg cursor-pointer transition-colors animate-pulse"
              title="Acknowledge Alert"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Acknowledge</span>
            </button>
          )}

          {/* Action Navigation */}
          {notification.workflowLink && (
            <button
              onClick={() => navigate(notification.workflowLink)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/10 cursor-pointer transition-all duration-200"
            >
              <span>Action</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

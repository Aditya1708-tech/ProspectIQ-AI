import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  getNotifications, getMorningBrief, getExecutiveBrief, 
  getNotificationTimeline, getNotificationAnalytics,
  markNotificationAsRead, acknowledgeNotification
} from '../services/api.js';

import { NotificationCard, NotificationItem } from '../components/notifications/NotificationCard.js';
import { NotificationFilters } from '../components/notifications/NotificationFilters.js';
import { NotificationTimeline, TimelineEvent } from '../components/notifications/NotificationTimeline.js';
import { MorningBriefCard } from '../components/notifications/MorningBriefCard.js';
import { ExecutiveBriefCard } from '../components/strategy/ExecutiveBriefCard.js';
import { CriticalAlertPanel } from '../components/notifications/CriticalAlertPanel.js';
import { NotificationAnalytics, NotificationAnalyticsData } from '../components/notifications/NotificationAnalytics.js';
import { NotificationSkeleton } from '../components/notifications/NotificationSkeleton.js';

import { 
  Bell, Activity, RefreshCw, Calendar, FileText, 
  ChevronRight, AlertCircle, Sparkles, LogOut 
} from 'lucide-react';
import { Layout } from '../components/layout/Layout.js';

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active sub-tab: 'feed' | 'timeline' | 'briefs' | 'analytics'
  const [activeTab, setActiveTab] = useState<'feed' | 'timeline' | 'briefs' | 'analytics'>('feed');

  // Core Data States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [morningBrief, setMorningBrief] = useState<string>('');
  const [executiveBrief, setExecutiveBrief] = useState<string>('');
  const [analytics, setAnalytics] = useState<NotificationAnalyticsData | null>(null);

  // Loaders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [notifsData, timelineData, morningData, execData, analyticsData] = await Promise.all([
        getNotifications(),
        getNotificationTimeline(),
        getMorningBrief(),
        getExecutiveBrief(),
        getNotificationAnalytics()
      ]);
      setNotifications(notifsData || []);
      setTimelineEvents(timelineData || []);
      setMorningBrief(morningData.briefing || '');
      setExecutiveBrief(execData.briefing || '');
      setAnalytics(analyticsData);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch NotificationIQ data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Register listener for real-time count updates
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('unread-notifications-updated', handleUpdate);
    return () => {
      window.removeEventListener('unread-notifications-updated', handleUpdate);
    };
  }, [loadData]);

  const handleRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n));
      // Dispatch custom event to notify parent headers to refresh count
      window.dispatchEvent(new Event('unread-notifications-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeNotification(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, acknowledgedStatus: true } : n));
      // Reload analytics to update rates
      const analyticsData = await getNotificationAnalytics();
      setAnalytics(analyticsData);
    } catch (e) {
      console.error(e);
    }
  };

  // Maps generic system alerts to banking intelligence alerts
  const getMappedAlert = (n: any) => {
    const num = parseInt(n.id.replace(/\D/g, ''), 10) || 0;
    const alertTemplates = [
      { title: 'Customer salary increased', message: 'Primary salary credits increased by 14.5% MoM, improving debt-to-income margin.', category: 'Credit' },
      { title: 'Large balance inflow detected', message: 'A recurring credit inflow transaction was verified, adjusting estimated monthly income.', category: 'Transaction' },
      { title: 'Dormant customer became eligible', message: 'Activity thresholds reached, qualifying dormant portfolio depositor for Retail Home Loan.', category: 'Eligibility' },
      { title: 'Credit utilization improved', message: 'Credit card utilization dropped below 30% benchmark limit. Underwriting index adjusted.', category: 'Score' },
      { title: 'Repayment behavior improved', message: 'Zero bounce history confirmed across all active ledger mandates for the last 12 months.', category: 'Score' },
      { title: 'Income estimation updated', message: 'AI model updated borrower estimated monthly income based on cash flow patterns.', category: 'Income' },
      { title: 'Home Loan eligibility detected', message: 'Disposable surplus margin validation matches Retail Home Loan eligibility parameters.', category: 'Eligibility' },
      { title: 'MSME opportunity detected', message: 'Tax ledger patterns verify business credit readiness for MSME Mortgage Loan.', category: 'Opportunity' },
      { title: 'Vehicle Loan opportunity detected', message: 'Automobile insurance debit checks match financing parameters for Retail Auto Loan.', category: 'Opportunity' },
      { title: 'FD customer eligible for secured loan', message: 'Fixed deposit asset verified as premium collateral for personal overdraft limit.', category: 'Eligibility' }
    ];

    const template = alertTemplates[num % alertTemplates.length];
    return {
      ...n,
      title: template.title,
      message: template.message,
      category: template.category
    };
  };

  const mappedNotifications = notifications.map(getMappedAlert);

  // Filtering Logic
  const filteredNotifications = mappedNotifications.filter(n => {
    if (priorityFilter !== 'ALL' && n.priority.toUpperCase() !== priorityFilter) return false;
    if (statusFilter === 'READ' && !n.readStatus) return false;
    if (statusFilter === 'UNREAD' && n.readStatus) return false;
    if (categoryFilter !== 'ALL' && n.category.toUpperCase() !== categoryFilter.toUpperCase()) return false;
    return true;
  });

  const unreadCount = mappedNotifications.filter(n => !n.readStatus).length;

  return (
    <Layout>
      <div className="space-y-6">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-400 flex items-center space-x-2 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Selectors */}
            <div className="flex bg-[#F6F8FA] p-1 border border-[#E5E7EB] rounded-2xl">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5
                  ${activeTab === 'feed' ? 'bg-[#006A4E] text-white shadow-md' : 'text-gray-700 hover:text-[#006A4E]'}`}
              >
                <span>Alerts Feed</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5
                  ${activeTab === 'timeline' ? 'bg-[#006A4E] text-white shadow-md' : 'text-gray-700 hover:text-[#006A4E]'}`}
              >
                <Calendar className="h-4 w-4" />
                <span>Timeline Feed</span>
              </button>
              <button
                onClick={() => setActiveTab('briefs')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5
                  ${activeTab === 'briefs' ? 'bg-[#006A4E] text-white shadow-md' : 'text-gray-700 hover:text-[#006A4E]'}`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Morning Briefs</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5
                  ${activeTab === 'analytics' ? 'bg-[#006A4E] text-white shadow-md' : 'text-gray-700 hover:text-[#006A4E]'}`}
              >
                <Activity className="h-4 w-4" />
                <span>Analytics Console</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {loading ? (
              <NotificationSkeleton />
            ) : (
              <>
                {/* 1. Alerts Feed */}
                {activeTab === 'feed' && (
                  <div className="space-y-6">
                    <NotificationFilters
                      priorityFilter={priorityFilter}
                      setPriorityFilter={setPriorityFilter}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      categoryFilter={categoryFilter}
                      setCategoryFilter={setCategoryFilter}
                    />

                    <div className="space-y-4">
                      {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12 bg-[#F6F8FA] border border-[#E5E7EB] rounded-3xl text-gray-500 text-xs font-semibold">
                          No notifications match the active filter criteria.
                        </div>
                      ) : (
                        filteredNotifications.map(n => (
                          <NotificationCard
                            key={n.id}
                            notification={n}
                            onRead={handleRead}
                            onAcknowledge={handleAcknowledge}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Timeline Feed */}
                {activeTab === 'timeline' && (
                  <NotificationTimeline events={timelineEvents} />
                )}

                {/* 3. Briefs */}
                {activeTab === 'briefs' && (
                  <div className="space-y-6">
                    <MorningBriefCard brief={morningBrief} />
                    <ExecutiveBriefCard brief={executiveBrief} />
                  </div>
                )}

                {/* 4. Analytics */}
                {activeTab === 'analytics' && analytics && (
                  <NotificationAnalytics analytics={analytics} />
                )}
              </>
            )}
          </div>

          {/* Right Alerts Sidebar */}
          <div className="space-y-6 font-semibold">
            <CriticalAlertPanel alerts={mappedNotifications} onAcknowledge={handleAcknowledge} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

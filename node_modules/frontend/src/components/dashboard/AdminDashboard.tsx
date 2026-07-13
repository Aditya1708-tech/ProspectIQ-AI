import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, LayoutDashboard } from 'lucide-react';
import { PlatformIQProfile } from '../../services/ai-client.js';
import { PlatformSummary } from './PlatformSummary.js';
import { EngineStatusGrid } from '../operations/EngineStatusGrid.js';
import { PerformanceDashboard } from '../operations/PerformanceDashboard.js';
import { SecurityCenter } from './SecurityCenter.js';
import { AuditCenter } from '../strategy/AuditCenter.js';
import { ConfigurationPanel } from './ConfigurationPanel.js';
import { BranchOverview } from './BranchOverview.js';
import { UserManagementTable } from './UserManagementTable.js';
import { OperationalAnalytics } from '../operations/OperationalAnalytics.js';
import { NotificationsPanel } from '../notifications/NotificationsPanel.js';
import { ExecutiveAdminSummary } from '../strategy/ExecutiveAdminSummary.js';
import { SystemHealthCard } from './SystemHealthCard.js';
import { LoadingSkeleton } from '../common/LoadingSkeleton.js';
import { EmptyState } from '../common/EmptyState.js';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<PlatformIQProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/admin/dashboard');
      if (!response.ok) {
        throw new Error(`Server returned error status code: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error?.message || 'Failed to fetch platform metrics data.');
      }
    } catch (err: any) {
      console.error("AdminDashboard fetch error:", err);
      setError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen text-slate-100 p-6 space-y-6">
      {/* Governance Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Enterprise Admin Console</h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Governance, Telemetry, and Operational Audits Control Center</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/30 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all duration-200"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Console Telemetry'}</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error || !data ? (
        <EmptyState message={error || "Admin metrics dataset offline."} />
      ) : (
        <div className="space-y-8">
          {/* Row 1: System Health Gauge and Summary Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1">
              <SystemHealthCard 
                summary={data.platformSummary} 
                cpu={data.performance.cpuUsagePct}
                memory={data.performance.memoryUsageMb}
              />
            </div>
            <div className="lg:col-span-2">
              <PlatformSummary summary={data.platformSummary} />
            </div>
          </div>

          {/* Row 2: Intelligence Engine Monitor */}
          <EngineStatusGrid engines={data.engineHealths} />

          {/* Row 3: Performance Telemetry & Security Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              <PerformanceDashboard metrics={data.performance} />
            </div>
            <div className="lg:col-span-1">
              <SecurityCenter security={data.security} />
            </div>
          </div>

          {/* Row 4: Compliance Audits Logs */}
          <AuditCenter logs={data.auditLogs} />

          {/* Row 5: Settings Config and Notifications Alert Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              <ConfigurationPanel config={data.configuration} />
            </div>
            <div className="lg:col-span-1">
              <NotificationsPanel notifications={data.notifications} />
            </div>
          </div>

          {/* Row 6: Branch overview Comparative matrix */}
          <BranchOverview branches={data.branches} />

          {/* Row 7: User Management productivity grid */}
          <UserManagementTable users={data.users} />

          {/* Row 8: Graphical Operational Analytics */}
          <OperationalAnalytics analytics={data.analytics} />

          {/* Row 9: audited Narrative Executive briefing */}
          <ExecutiveAdminSummary summary={data.summary} />
        </div>
      )}
    </div>
  );
};

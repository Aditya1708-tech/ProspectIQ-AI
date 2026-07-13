import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { getUnreadNotifications } from '../../services/api.js';

import { UnreadCounter } from '../notifications/UnreadCounter.js';
import {
  Activity,
  Briefcase,
  Users,
  Bell,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Building,
  Menu,
  KeyRound,
  Home,
  Target,
  Handshake
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadNotifications();
      setUnreadCount(data ? data.length : 0);
    } catch (e) {
      console.error('Failed to load notifications count in Layout:', e);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    window.addEventListener('unread-notifications-updated', fetchUnreadCount);
    
    // Listen for custom refetches
    const handleRefetch = () => {
      fetchUnreadCount();
    };
    window.addEventListener('refetch-notifications', handleRefetch);
    
    return () => {
      window.removeEventListener('unread-notifications-updated', fetchUnreadCount);
      window.removeEventListener('refetch-notifications', handleRefetch);
    };
  }, [fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getMenuItems = () => {
    const roles = user?.roles || [];
    const items = [];

    // Home is shared by everyone
    items.push({
      title: 'Home',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      allowed: true
    });

    if (roles.includes('RM') || roles.includes('ADMIN')) {
      items.push({
        title: 'High Quality Leads',
        path: '/customers',
        icon: <Target className="h-5 w-5" />,
        allowed: true
      });
      items.push({
        title: 'Conversion Workspace',
        path: '/workspace',
        icon: <Handshake className="h-5 w-5" />,
        allowed: true
      });
    }

    items.push({
      title: 'Lending Alerts',
      path: '/notifications',
      icon: <Bell className="h-5 w-5" />,
      allowed: true
    });

    items.push({
      title: 'Platform Console',
      path: '/import',
      icon: <Database className="h-5 w-5" />,
      allowed: roles.includes('ADMIN')
    });

    return items;
  };

  const menuItems = getMenuItems();

  const getPageTitle = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard') return 'Home';
    if (pathname === '/workspace') return 'Conversion Workspace';
    if (pathname === '/customers') return 'High Quality Leads';
    if (pathname.startsWith('/customers/')) {
      if (pathname.endsWith('/explain')) return 'ExplainIQ Audit Center';
      return 'Relationship 360 Workspace';
    }
    if (pathname === '/notifications') return 'Lending Alerts';
    if (pathname === '/import') return 'Enterprise Data Ingestion Pipeline';
    return 'ProspectIQ AI';
  };

  return (
    <div className="h-screen overflow-hidden flex bg-idbi-bg text-idbi-text font-sans antialiased">
      {/* SIDEBAR - Desktop */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-[#00563F] text-white transition-all duration-300 border-r border-[#E5E7EB] relative z-20 flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-[#006A4E]/10">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-[#F58220] rounded-lg">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white uppercase">
                ProspectIQ <span className="text-[#F58220] text-sm">AI</span>
              </span>
            </div>
          ) : (
            <div className="mx-auto p-1.5 bg-[#F58220] rounded-lg">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems
            .filter((item) => item.allowed)
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 relative group cursor-pointer ${
                    isActive
                      ? 'bg-[#006A4E] text-white'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                  title={collapsed ? item.title : undefined}
                >
                  {/* Left Active border indicator in orange */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#F58220] rounded-r-md" />
                  )}
                  
                  <div className="flex-shrink-0">{item.icon}</div>
                  
                  {!collapsed && (
                    <span className="truncate tracking-wide">{item.title}</span>
                  )}
                  
                  {collapsed && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 bg-slate-900 text-xs px-2 py-1 rounded shadow-md z-30 font-medium whitespace-nowrap">
                      {item.title}
                    </div>
                  )}
                </button>
              );
            })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#00563F]/5 flex flex-col space-y-3">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white uppercase">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-emerald-200 font-medium uppercase tracking-wider truncate">
                  {user?.roles.join(', ')} Manager
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-bold text-white uppercase">
              {user?.name.charAt(0) || 'U'}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-red-200 hover:text-white hover:bg-red-700/20 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR PANEL */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu drawer */}
          <div className="relative flex flex-col w-64 bg-[#00563F] text-white z-50 animate-slide-in-drawer">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-[#00563F]">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-[#F58220] rounded-lg">
                  <KeyRound className="h-5 w-5 text-white" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-white uppercase">
                  ProspectIQ <span className="text-[#F58220] text-sm">AI</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-3 py-4 space-y-1.5">
              {menuItems
                .filter((item) => item.allowed)
                .map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.title}
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#006A4E] text-white'
                          : 'text-emerald-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.icon}
                      <span className="tracking-wide">{item.title}</span>
                    </button>
                  );
                })}
            </nav>
            
            <div className="p-4 border-t border-white/10 bg-[#00563F]">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
                  <p className="text-[9px] text-emerald-200 font-medium uppercase tracking-wider">
                    {user?.roles.join(', ')} Manager
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-200 hover:text-white hover:bg-red-700/20 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden min-w-0 relative">
        {/* NAVBAR - Green Gradient */}
        <header className="h-16 bg-gradient-to-r from-[#006A4E] to-[#00563F] text-white flex justify-between items-center px-4 md:px-6 shadow-md relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1 text-emerald-100 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div>
              <h2 className="text-sm md:text-base font-bold tracking-tight text-white">
                {getPageTitle()}
              </h2>
              <div className="flex items-center space-x-1 mt-0.5">
                <Building className="h-3 w-3 text-[#F58220]" />
                <span className="text-[9px] text-emerald-100 font-bold uppercase tracking-wider">
                  IDBI Mumbai HQ Branch
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Customer Search input in navbar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads/prospects..."
                className="w-48 lg:w-64 bg-white/10 hover:bg-white/15 focus:bg-white text-xs text-white focus:text-[#222222] placeholder-emerald-100/70 focus:placeholder-slate-400 rounded-lg px-3 py-1.5 pl-8 border border-transparent focus:border-[#F58220] focus:outline-none transition-all"
              />
              <Search className="h-3.5 w-3.5 text-emerald-100 absolute left-2.5 pointer-events-none transition-colors" />
            </form>

            {/* Notifications icon button */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 hover:bg-white/10 text-white rounded-xl transition-all relative cursor-pointer"
              id="layout-notifications-button"
            >
              <Bell className="h-5 w-5" />
              <UnreadCounter count={unreadCount} />
            </button>

            {/* Profile widget details */}
            <div className="hidden lg:flex items-center space-x-2.5 pl-2 border-l border-white/10">
              <div className="text-right">
                <span className="block text-xs font-bold text-white leading-none">
                  {user?.name}
                </span>
                <span className="block text-[9px] text-[#F58220] font-bold uppercase tracking-wider mt-1">
                  IDBI RM Console
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black border border-white/10 uppercase text-white">
                {user?.name.charAt(0) || 'U'}
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="md:hidden p-2 hover:bg-white/10 text-white rounded-xl cursor-pointer"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto pb-20">
          {children}
        </main>
      </div>
    </div>
  );
};

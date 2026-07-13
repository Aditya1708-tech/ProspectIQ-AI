import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { login } from '../services/api.js';
import { KeyRound, ShieldCheck, Users, Info, Eye, EyeOff, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setError(null);
    setSubmitting(true);
    setShowForgotMsg(false);
    try {
      const data = await login({ username, password });
      loginUser(data.accessToken, data.refreshToken, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (userParam: string) => {
    setError(null);
    setSubmitting(true);
    setShowForgotMsg(false);
    try {
      const data = await login({ username: userParam, password: 'password123' });
      loginUser(data.accessToken, data.refreshToken, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-idbi-bg font-sans">
      {/* LEFT COLUMN: HERO PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00836C] to-[#006B58] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F58220]/10 rounded-full blur-[100px]" />

        <div className="flex items-center space-x-3 z-10">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight uppercase">
            IDBI Bank <span className="text-[#F58220]">ProspectIQ</span>
          </span>
        </div>

        {/* Minimalist illustration overlay in hero */}
        <div className="space-y-6 max-w-lg z-10 my-auto">
          <div className="p-6 bg-white/5 border border-white/10 rounded-[14px] backdrop-blur-sm max-w-md mb-8">
            <ShieldCheck className="h-12 w-12 text-[#F58220] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Internal AI Command Center</h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Behavioral Credit Intelligence Platform powered by Explainable Artificial Intelligence models. Restricted access console for authenticated relationship managers and portfolio administrators.
            </p>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
            Enterprise Relationship <br />
            <span className="text-[#F58220]">Intelligence Engine</span>
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
            Empowering Relationship Managers with real-time portfolio analytics, next-best-action models, predictive attrition tracking, and explainable AI insights.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-[14px] border border-white/10">
              <span className="text-[#F58220] font-bold text-base block">PredictIQ</span>
              <span className="text-xs text-emerald-200 font-medium">Attrition Analytics</span>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-[14px] border border-white/10">
              <span className="text-[#F58220] font-bold text-base block">NBAIQ</span>
              <span className="text-xs text-emerald-200 font-medium">Next Best Action Playbooks</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between items-center z-10 text-xs text-emerald-200 font-medium">
          <span>Official Internal Use Only</span>
          <span>© 2026 IDBI Bank Ltd.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-5 bg-white p-6 md:p-8 rounded-[14px] border border-[#D9E4E1] shadow-xl">
          <div className="text-center lg:text-left space-y-2">
            {/* Header info (centered on mobile, left on desktop) */}
            <div className="flex justify-center lg:justify-start lg:hidden mb-4">
              <div className="p-2.5 bg-[#00836C]/10 rounded-xl border border-[#00836C]/20">
                <KeyRound className="h-6 w-6 text-[#00836C]" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-idbi-text tracking-tight">Sign In to ProspectIQ</h2>
            <p className="text-xs text-idbi-textSec font-semibold uppercase tracking-wider">
              IDBI Banking Intelligence Command Center
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] flex items-center gap-3 text-xs text-idbi-error font-semibold">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-idbi-error" />
              <span>{error}</span>
            </div>
          )}

          {showForgotMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-[14px] flex items-start gap-2.5 text-xs text-idbi-info font-medium leading-relaxed">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-idbi-info" />
              <span>
                Please contact the IDBI Bank Central Systems Administrator at hq-support@idbibank.com to reset credentials or modify access permissions.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-idbi-textSec uppercase tracking-wide mb-1.5">
                Username / Login ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full bg-idbi-bg border border-idbi-border hover:border-slate-400 focus:border-idbi-green rounded-[14px] px-4 py-2.5 pl-10 text-sm text-idbi-text placeholder-slate-400 focus:outline-none transition-colors"
                  placeholder="Enter your username (e.g. priya)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                />
                <UserIcon className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-idbi-textSec uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotMsg(true)}
                  className="text-xs text-idbi-green hover:text-idbi-darkGreen font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-idbi-bg border border-idbi-border hover:border-slate-400 focus:border-idbi-green rounded-[14px] px-4 py-2.5 pl-10 pr-10 text-sm text-idbi-text placeholder-slate-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-idbi-textSec pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-idbi-border text-idbi-green focus:ring-idbi-green"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F58220] hover:bg-[#D96B12] active:scale-[0.98] text-white py-2.5 px-4 rounded-[14px] font-bold tracking-wide transition-all shadow-md shadow-[#F58220]/10 mt-2 text-sm cursor-pointer"
              disabled={submitting || !username || !password}
            >
              {submitting ? 'Verifying Credentials...' : 'Secure Sign In'}
            </button>
          </form>

          {/* Quick Access panel in brand theme */}
          <div className="mt-4 pt-4 border-t border-idbi-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-idbi-textSec uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#F58220]" />
              <span>Hackathon Quick Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                onClick={() => handleQuickLogin('priya')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-idbi-green text-[10px]">Priya Sharma</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Retail RM (priya)</div>
              </button>
              <button
                onClick={() => handleQuickLogin('anil')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-idbi-green text-[10px]">Anil Verma</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Retail RM (anil)</div>
              </button>
              <button
                onClick={() => handleQuickLogin('sunita')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-idbi-green text-[10px]">Sunita Iyer</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Retail RM (sunita)</div>
              </button>
              <button
                onClick={() => handleQuickLogin('sunil')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-[#F58220] text-[10px]">Sunil Mehta</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Branch Manager (sunil)</div>
              </button>
              <button
                onClick={() => handleQuickLogin('amit')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-[#F58220] text-[10px]">Amit Shah</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Regional Mgr (amit)</div>
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="quick-access-btn py-1 px-2 text-left bg-idbi-bg border border-idbi-border rounded-[14px] transition-all cursor-pointer hover:bg-idbi-lightGreen"
                disabled={submitting}
              >
                <div className="font-bold text-[#F58220] text-[10px]">HO Admin</div>
                <div className="text-[8px] text-idbi-textSec font-semibold">Administrator (admin)</div>
              </button>
            </div>
          </div>

          {/* Secure Audit Badging */}
          <div className="flex items-center justify-center space-x-2 pt-2 text-[10px] text-[#8D98A5] font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-[#2AA85A]" />
            <span>256-Bit SSL Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};


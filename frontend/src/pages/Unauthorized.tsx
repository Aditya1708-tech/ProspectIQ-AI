import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          You do not have the required permissions to access this dashboard. If you believe this is an error, please contact your administrator.
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors duration-200"
          >
            Go Back
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 rounded-lg text-sm font-semibold transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { PlayBeatLogo } from '../common/PlayBeatLogo';

interface AdminLoginViewProps {
  onBackToStorefront: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onBackToStorefront
}) => {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950/80 to-[#050811] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <button
          onClick={onBackToStorefront}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Open Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Shield className="w-4 h-4" />
          <span>PORTAL: /admin</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <PlayBeatLogo size="lg" />
            <p className="text-xs text-slate-400">
              The administration portal is unavailable until server-side authentication is configured.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-xs leading-relaxed text-amber-100">
            Access is locked because this app does not yet have a server-validated admin sign-in. Browser-only passwords and session flags are not secure.
          </div>

          {/* Storefront return */}
          <div className="pt-2 text-center">
            <button
              onClick={onBackToStorefront}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 text-center text-xs text-slate-500 font-mono">
        PlayBeat Entertainment Network · Enterprise IPTV Core · Secure Gateway
      </div>
    </div>
  );
};

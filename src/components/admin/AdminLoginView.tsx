import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Tv, ArrowLeft, KeyRound } from 'lucide-react';
import { PlayBeatLogo } from '../common/PlayBeatLogo';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToStorefront: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onBackToStorefront
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials provided by user: admin@playbeat.digital / playbeat1122
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === 'admin@playbeat.digital' && cleanPass === 'playbeat1122') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Please use admin@playbeat.digital / playbeat1122');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail('admin@playbeat.digital');
    setPassword('playbeat1122');
    setError(null);
  };

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
              Authorized access for IPTV node control, Cloudflare proxy &amp; streaming hub
            </p>
          </div>

          {/* Quick Fill Credentials Banner */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-cyan-300 font-semibold font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Configured Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-2 py-0.5 rounded transition-colors"
              >
                Quick Fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>Username: <strong className="text-white">admin@playbeat.digital</strong></div>
              <div>Password: <strong className="text-white">playbeat1122</strong></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Admin Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@playbeat.digital"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080d1a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080d1a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Storefront return */}
          <div className="pt-2 text-center">
            <button
              onClick={onBackToStorefront}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Return to Public Storefront (850+ Free Channels)
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

import React, { useState } from 'react';
import { 
  Tv, 
  Film, 
  Radio, 
  Calendar, 
  Layers, 
  Smartphone, 
  Search, 
  User, 
  Bookmark, 
  Menu, 
  X, 
  CreditCard, 
  ShieldAlert, 
  Users, 
  Sparkles,
  HelpCircle,
  Play,
  Lock,
  ShieldCheck
} from 'lucide-react';

import { PlayBeatLogo } from '../common/PlayBeatLogo';

interface PlayBeatHeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  myListCount: number;
  onOpenSearch: () => void;
  onNavigateToAdmin: () => void;
}

export const PlayBeatHeader: React.FC<PlayBeatHeaderProps> = ({
  activeSection,
  onNavigate,
  myListCount,
  onOpenSearch,
  onNavigateToAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean Storefront navigation - completely open, no packages/paywalls
  const mainNav = [
    { id: 'home', label: 'Home' },
    { id: 'live', label: 'Live TV (850+)' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
    { id: 'guide', label: 'TV Guide' },
    { id: 'devices', label: 'Devices' },
    { id: 'support', label: 'Support' }
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050811]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center text-left group hover:opacity-90 transition-opacity"
            title="PlayBeat Entertainment Home"
          >
            <PlayBeatLogo size="sm" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {mainNav.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 bg-white/[0.08] shadow-xs border border-white/[0.08]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Free Access Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Free · No Subscription Required</span>
          </div>

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-slate-300 transition-colors"
            title="Search 850+ live channels, movies, series..."
          >
            <Search className="w-4 h-4" />
          </button>

          {/* My List */}
          <button
            onClick={() => handleNav('account')}
            className="relative hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 transition-colors"
            title="My Saved List"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">My List</span>
            {myListCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-[#050811] text-[10px] font-bold flex items-center justify-center font-mono">
                {myListCount}
              </span>
            )}
          </button>

          {/* Direct Admin Access Icon */}
          <button
            onClick={onNavigateToAdmin}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            title="Admin Portal (/admin)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] font-mono">Admin</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-white/[0.04] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-4 pb-2 border-t border-white/[0.08] mt-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open Streaming · All 850+ Channels Free</span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {mainNav.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => handleNav('account')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04]"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Account</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 font-mono"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin (/admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

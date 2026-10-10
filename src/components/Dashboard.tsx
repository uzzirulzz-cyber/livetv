import React from 'react';
import { CustomerLine, ProviderCreditLog, ProviderInfo } from '../types/iptv';
import {
  Users,
  Clock,
  Coins,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight,
  Tv,
  Smartphone,
  Radio,
  Globe2,
  SearchCheck,
  ExternalLink,
  Activity,
  Sparkles
} from 'lucide-react';
import { LIVE_PAGES } from '../seo';

interface DashboardProps {
  lines: CustomerLine[];
  balanceCenti: number;
  providerInfo: ProviderInfo | null;
  creditLogs: ProviderCreditLog[];
  isLoadingProvider: boolean;
  onRefreshProvider: () => void;
  onOpenCreateModal: (type?: 'XTREAM' | 'ACTIVECODE' | 'MAC', isTrial?: boolean) => void;
  onSelectLine: (line: CustomerLine) => void;
  onViewAllLines: () => void;
  onViewLedger: () => void;
}

const panel = 'rounded-2xl border border-white/[0.08] bg-slate-950/55 shadow-[0_18px_60px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl';
const metric = 'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/25';

export const Dashboard: React.FC<DashboardProps> = ({
  lines,
  balanceCenti,
  providerInfo,
  creditLogs,
  isLoadingProvider,
  onRefreshProvider,
  onOpenCreateModal,
  onSelectLine,
  onViewAllLines,
  onViewLedger
}) => {
  const activeLines = lines.filter(l => l.status === 'ACTIVE').length;
  const trialLines = lines.filter(l => l.status === 'TRIAL').length;
  const expiredLines = lines.filter(l => l.status === 'EXPIRED').length;
  const creditsFormatted = (balanceCenti / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringSoon = lines.filter(line => {
    if (line.status === 'EXPIRED') return false;
    const exp = new Date(line.expiryDate);
    return exp >= now && exp <= nextWeek;
  });

  const usedTrial = providerInfo?.used_trial;
  const trialLimit = providerInfo?.allow_trial;
  const trialUsedNumber = usedTrial === undefined ? NaN : Number(usedTrial);
  const trialLimitNumber = trialLimit === undefined ? NaN : Number(trialLimit);
  const trialQuotaAvailable = Number.isFinite(trialUsedNumber) && Number.isFinite(trialLimitNumber);
  const providerStatus = providerInfo?.api_status?.trim();
  const providerOnline = /online|connected|operational|active|ok/i.test(providerStatus || '');
  const statusLabel = providerStatus || 'Status unavailable';
  const seoPages = Object.keys(LIVE_PAGES).length;

  const actionItems = [
    { title: '24h Free Trial', detail: 'Xtream Codes · trial access', type: 'XTREAM' as const, trial: true, Icon: Clock, accent: 'amber' },
    { title: 'Xtream Line', detail: 'Multi-screen · 1–12 months', type: 'XTREAM' as const, trial: false, Icon: Tv, accent: 'violet' },
    { title: 'MAG / STB Portal', detail: 'MAC hardware binding', type: 'MAC' as const, trial: false, Icon: Radio, accent: 'cyan' },
    { title: 'ActiveCode User', detail: 'Numeric code for APK', type: 'ACTIVECODE' as const, trial: false, Icon: Smartphone, accent: 'emerald' }
  ];
  const accentClasses: Record<string, string> = {
    amber: 'bg-amber-300/10 text-amber-200 border-amber-200/15 group-hover:border-amber-200/35',
    violet: 'bg-violet-300/10 text-violet-200 border-violet-200/15 group-hover:border-violet-200/35',
    cyan: 'bg-cyan-300/10 text-cyan-200 border-cyan-200/15 group-hover:border-cyan-200/35',
    emerald: 'bg-emerald-300/10 text-emerald-200 border-emerald-200/15 group-hover:border-emerald-200/35'
  };

  return (
    <div className="space-y-6 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl border border-amber-100/10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.18),transparent_35%),linear-gradient(120deg,#101827,#080c16_70%)] p-6 shadow-[0_30px_100px_-48px_rgba(245,158,11,0.38)] sm:p-8">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-amber-200/10" />
        <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-amber-200/[0.07]" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-100/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/85">
              <Sparkles className="h-3.5 w-3.5" /> PlayBeat Live Operations
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Good to see you.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300/75">A clear view of reseller activity, service health, and the public storefront in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onRefreshProvider} disabled={isLoadingProvider} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-amber-200/25 hover:bg-white/[0.08] disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${isLoadingProvider ? 'animate-spin' : ''}`} /> Refresh provider
            </button>
            <button onClick={() => onOpenCreateModal()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-950/30 transition hover:brightness-110">
              <span className="text-base leading-none">+</span> Create a line
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className={metric}>
          <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-amber-300/[0.07] blur-2xl transition group-hover:bg-amber-300/[0.13]" />
          <div className="relative flex items-center justify-between text-xs text-slate-400"><span>Reseller balance</span><Coins className="h-4 w-4 text-amber-200" /></div>
          <div className="relative mt-4 font-mono text-3xl font-semibold tracking-tight text-white">{creditsFormatted}<span className="ml-2 text-xs font-medium text-slate-400">credits</span></div>
          <div className="relative mt-3 flex justify-between border-t border-white/[0.07] pt-3 text-[11px] text-slate-500"><span>Upstream credit</span><span className="font-mono text-slate-300">{providerInfo?.user_credit || 'Unavailable'}</span></div>
        </article>
        <article className={metric}>
          <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-violet-300/[0.07] blur-2xl" />
          <div className="relative flex items-center justify-between text-xs text-slate-400"><span>Active subscriptions</span><Users className="h-4 w-4 text-violet-200" /></div>
          <div className="relative mt-4 font-mono text-3xl font-semibold tracking-tight text-white">{activeLines}<span className="ml-2 text-xs font-medium text-slate-400">lines</span></div>
          <div className="relative mt-3 flex gap-2 border-t border-white/[0.07] pt-3 text-[11px] text-slate-500"><span>{trialLines} trials</span><span>·</span><span>{expiredLines} expired</span></div>
        </article>
        <article className={metric}>
          <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-cyan-300/[0.07] blur-2xl" />
          <div className="relative flex items-center justify-between text-xs text-slate-400"><span>Provider trial quota</span><Clock className="h-4 w-4 text-cyan-200" /></div>
          <div className="relative mt-4 font-mono text-3xl font-semibold tracking-tight text-white">{trialQuotaAvailable ? <>{usedTrial} <span className="text-lg text-slate-500">/</span> {trialLimit}</> : '—'}</div>
          <div className="relative mt-3 border-t border-white/[0.07] pt-3 text-[11px] text-slate-500">{trialQuotaAvailable ? <><span className="font-mono text-cyan-200">{Math.max(0, trialLimitNumber - trialUsedNumber)}</span> trials remaining today</> : 'Quota unavailable until provider sync'}</div>
        </article>
        <article className={metric}>
          <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-emerald-300/[0.07] blur-2xl" />
          <div className="relative flex items-center justify-between text-xs text-slate-400"><span>Provider gateway</span><Activity className="h-4 w-4 text-emerald-200" /></div>
          <div className="relative mt-4 flex items-center gap-2.5 text-lg font-semibold text-white"><span className={`h-2.5 w-2.5 rounded-full ${providerOnline ? 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.65)]' : 'bg-slate-500'}`} />{statusLabel}</div>
          <div className="relative mt-3 truncate border-t border-white/[0.07] pt-3 font-mono text-[11px] text-slate-500">Account: {providerInfo?.api_username || 'Unavailable'}</div>
        </article>
      </section>

      <section className={`${panel} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200/15 bg-sky-200/[0.07] text-sky-100"><SearchCheck className="h-5 w-5" /></div>
          <div>
            <h2 className="text-sm font-semibold text-white">Public storefront discovery</h2>
            <p className="mt-1 text-xs leading-5 text-slate-400">Crawler access is allowed for public pages. Private admin and API paths stay excluded. SEO rules do not guarantee search indexing.</p>
            <div className="mt-2 text-[11px] text-slate-500">{seoPages} canonical public pages · updated through storefront Worker</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <a href="https://playbeat.live/robots.txt" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-200/30 hover:text-white">Crawler rules <ExternalLink className="h-3.5 w-3.5" /></a>
          <a href="https://playbeat.live/sitemap.xml" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-200/30 hover:text-white">XML sitemap <ExternalLink className="h-3.5 w-3.5" /></a>
          <a href="https://playbeat.live/" className="inline-flex items-center gap-1.5 rounded-lg bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-300/15">Open storefront <Globe2 className="h-3.5 w-3.5" /></a>
        </div>
      </section>

      <section className={`${panel} p-5 sm:p-6`}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/70">Quick actions</p><h2 className="mt-1 text-lg font-semibold text-white">Create a customer line</h2></div>
          <p className="text-xs text-slate-500">Choose a line type to begin</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actionItems.map(({ title, detail, type, trial, Icon, accent }) => (
            <button key={title} onClick={() => onOpenCreateModal(type, trial)} className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${accentClasses[accent]}`}><Icon className="h-4 w-4" /></div>
              <div className="min-w-0"><div className="text-xs font-semibold text-white transition group-hover:text-amber-100">{title}</div><div className="mt-1 truncate text-[11px] text-slate-500">{detail}</div></div>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-600 transition group-hover:text-amber-100" />
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className={`${panel} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/70">Renewal watch</p><h2 className="mt-1 text-sm font-semibold text-white">Expiring in 7 days</h2></div>
            <button onClick={onViewAllLines} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white">All lines <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
          {expiringSoon.length === 0 ? (
            <div className="rounded-xl border border-emerald-200/10 bg-emerald-200/[0.035] py-8 text-center text-xs text-slate-400"><ShieldCheck className="mx-auto mb-2 h-6 w-6 text-emerald-200/80" />No active lines are expiring in the next 7 days.</div>
          ) : <div className="space-y-2">{expiringSoon.map(line => (
            <button key={line.id} onClick={() => onSelectLine(line)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:border-amber-200/20 hover:bg-white/[0.045]">
              <div className="min-w-0"><div className="truncate text-xs font-semibold text-white">{line.name} <span className="font-mono font-normal text-slate-500">· {line.lineType}</span></div><div className="mt-1 truncate font-mono text-[11px] text-slate-500">User: {line.providerUsername}</div></div>
              <div className="shrink-0 text-right"><div className="font-mono text-xs tabular-nums text-amber-100">{line.expiryDate}</div><div className="mt-1 text-[10px] text-slate-500">{line.connections} screen(s)</div></div>
            </button>
          ))}</div>}
        </div>
        <div className={`${panel} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/70">Provider sync</p><h2 className="mt-1 text-sm font-semibold text-white">Recent credit activity</h2></div>
            <button onClick={onViewLedger} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white">Full ledger <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
          {creditLogs.length === 0 ? <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-8 text-center text-xs text-slate-500">No provider credit activity is available yet.</div> : <div className="space-y-2">{creditLogs.slice(0, 5).map(log => {
            const isCredit = log.credits_charge.startsWith('+');
            return <div key={log.log_id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <div className="min-w-0"><div className="truncate text-xs font-medium text-slate-200">{log.info}</div><div className="mt-1 font-mono text-[10px] text-slate-500">#{log.log_id} · {log.date}</div></div>
              <div className="shrink-0 text-right"><div className={`font-mono text-xs font-semibold tabular-nums ${isCredit ? 'text-emerald-200' : 'text-rose-200'}`}>{log.credits_charge} cr</div><div className="mt-1 font-mono text-[10px] text-slate-500">Left: {log.credits_left}</div></div>
            </div>;
          })}</div>}
        </div>
      </section>
    </div>
  );
};

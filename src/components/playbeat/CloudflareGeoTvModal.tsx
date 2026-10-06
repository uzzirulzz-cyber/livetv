import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Database, 
  Cloud, 
  Radio, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import { Channel } from '../../types/playbeat';

interface CloudflareGeoTvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadLiveChannels?: (channels: Channel[]) => void;
  onPlayChannel?: (channel: Channel) => void;
}

export const CloudflareGeoTvModal: React.FC<CloudflareGeoTvModalProps> = ({
  isOpen,
  onClose,
  onLoadLiveChannels,
  onPlayChannel
}) => {
  const [activeTab, setActiveTab] = useState<'CLOUDFLARE' | 'GEOTV' | 'CHANNELS'>('CLOUDFLARE');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Cloudflare live verify state
  const [isVerifyingCf, setIsVerifyingCf] = useState(false);
  const [cfVerifyResult, setCfVerifyResult] = useState<any>(null);

  // GeoTV channels sync state
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [geoChannels, setGeoChannels] = useState<any[]>([]);
  const [channelCount, setChannelCount] = useState<number>(0);
  const [channelSyncMsg, setChannelSyncMsg] = useState<string | null>(null);

  // Default credentials info
  const cfInfo = {
    accountId: '079c27c9f20414f4a992c4ee36eef64d',
    apiTokenMasked: 'cfat_jM9d••••••••••••••••••••••••••••••••0f44931e',
    accessKeyId: 'b8cd90e0bf2367c79f254f443ed39339',
    s3Endpoint: 'https://079c27c9f20414f4a992c4ee36eef64d.r2.cloudflarestorage.com',
    secretKeyMasked: 'c06dc787••••••••••••••••••••••••••••••••552222c8'
  };

  const geoTvInfo = {
    host: 'http://geotv.space:8880',
    username: '3fa35bc1',
    password: '••••••••',
    rawPass: '3cc73db1',
    package: 'World Package, Channels + Vods (Family)',
    renewal: '05-11-2026',
    m3uPlus: 'http://geotv.space:8880/get.php?username=3fa35bc1&password=3cc73db1&type=m3u_plus&output=ts',
    m3uStandard: 'http://geotv.space:8880/get.php?username=3fa35bc1&password=3cc73db1&type=m3u&output=ts',
    webtvList: 'http://geotv.space:8880/get.php?username=3fa35bc1&password=3cc73db1&type=webtvlist&output=mpegts',
    appUrl: 'http://geotv.space:8880/app.php',
    cpanelUrl: 'https://store.stariptv.pk/panel/m3u-4ffe0b9c5bfbd4a2d4325fc9aab6e8f1'
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const verifyCloudflareToken = async () => {
    setIsVerifyingCf(true);
    try {
      const res = await fetch('/api/cloudflare/verify');
      const data = await res.json();
      setCfVerifyResult(data);
    } catch (err: any) {
      setCfVerifyResult({ success: false, errors: [{ message: err.message }] });
    } finally {
      setIsVerifyingCf(false);
    }
  };

  const syncGeoTvChannels = async (force = false) => {
    setIsLoadingChannels(true);
    setChannelSyncMsg(null);
    try {
      const res = await fetch(`/api/iptv/geotv/channels${force ? '?refresh=1' : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.channels)) {
        setGeoChannels(data.channels);
        setChannelCount(data.channels.length);
        setChannelSyncMsg(`Successfully parsed ${data.channels.length} live stream channels!`);

        // Convert to PlayBeat channel format if callback passed
        if (onLoadLiveChannels) {
          const converted: Channel[] = data.channels.map((c: any, idx: number) => {
            const streamId = c.streamId || String(idx + 1);
            const hlsUrl = c.hlsUrl || `/api/proxy/hls/stream.m3u8?channelId=${streamId}`;
            const tsUrl = c.tsUrl || `/api/proxy/stream?url=${encodeURIComponent(c.streamUrl || '')}`;
            const logoUrl = c.logo && c.logo.startsWith('http://')
              ? `/api/proxy/image?url=${encodeURIComponent(c.logo)}`
              : (c.logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=120&h=120&q=80');

            return {
              id: `geo_ch_${idx + 1}`,
              name: c.name,
              number: 200 + idx,
              logo: logoUrl,
              category: (c.category || (c.group.includes('Movie') || c.group.includes('Bollywood') ? 'Movies' : 'Entertainment')) as any,
              country: c.group.includes('PK') ? 'Pakistan' : c.group.includes('IN') ? 'India' : 'Global',
              language: c.group.includes('PK') ? 'Urdu' : c.group.includes('IN') ? 'Hindi' : 'English',
              streamUrl: hlsUrl,
              hlsUrl: hlsUrl,
              tsUrl: tsUrl,
              streamId: streamId,
              groupTitle: c.group,
              epgId: `EPG_GEO_${idx + 1}`,
              isPremium: true,
              isLive: true,
              resolution: c.name.includes('4K') ? '4K' : '1080p',
              currentProgram: {
                title: `${c.name} — Live Stream Broadcast`,
                startTime: '00:00',
                endTime: '23:59',
                progressPercentage: 50,
                synopsis: `Broadcasted via GeoTV Space World Package (${c.group}). Cloudflare DoH Edge relay.`
              },
              nextProgram: {
                title: 'Continuous 24/7 Feed',
                startTime: '00:00',
                endTime: '00:00'
              }
            };
          });
          onLoadLiveChannels(converted);
        }
      } else {
        setChannelSyncMsg(data.error || 'Failed to fetch playlist channels');
      }
    } catch (err: any) {
      setChannelSyncMsg(`Sync error: ${err.message}`);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Auto verify token on open
      verifyCloudflareToken();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-[#0c1326] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">
                  Cloudflare &amp; GeoTV Integration Center
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cloudflare Account 079c27c9f20414f4a992c4ee36eef64d · GeoTV Space (Port 8880)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-white/[0.08] px-5 bg-black/30">
          <button
            onClick={() => setActiveTab('CLOUDFLARE')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'CLOUDFLARE'
                ? 'border-orange-500 text-orange-400 bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloudflare Token &amp; R2</span>
          </button>

          <button
            onClick={() => setActiveTab('GEOTV')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'GEOTV'
                ? 'border-cyan-500 text-cyan-400 bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>GeoTV Space Line Details</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CHANNELS');
              if (geoChannels.length === 0) syncGeoTvChannels();
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'CHANNELS'
                ? 'border-blue-500 text-blue-400 bg-white/[0.02]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Channels Parser ({channelCount > 0 ? channelCount : 'Sync'})</span>
          </button>
        </div>

        {/* Tab 1: Cloudflare Token & R2 */}
        {activeTab === 'CLOUDFLARE' && (
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
            {/* Live Verification Status Card */}
            <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Cloudflare API Token:</span>
                    {cfVerifyResult?.success ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE &amp; VERIFIED
                      </span>
                    ) : isVerifyingCf ? (
                      <span className="text-amber-400 flex items-center gap-1 font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">Status Pending</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-mono">
                    Token ID: {cfInfo.accessKeyId} · Token Type: Account API Bearer
                  </p>
                </div>
              </div>

              <button
                onClick={verifyCloudflareToken}
                disabled={isVerifyingCf}
                className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingCf ? 'animate-spin' : ''}`} />
                <span>Re-verify Token</span>
              </button>
            </div>

            {/* Cloudflare Verification JSON Output */}
            {cfVerifyResult && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Cloudflare API Verification Response:
                </span>
                <pre className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(cfVerifyResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Credential Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account ID</span>
                  <button onClick={() => handleCopy(cfInfo.accountId, 'acc')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-white truncate">{cfInfo.accountId}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">R2 S3 Endpoint</span>
                  <button onClick={() => handleCopy(cfInfo.s3Endpoint, 'end')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'end' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-white truncate">{cfInfo.s3Endpoint}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">R2 Access Key ID</span>
                  <button onClick={() => handleCopy(cfInfo.accessKeyId, 'kid')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'kid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-white truncate">{cfInfo.accessKeyId}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secret Access Key</span>
                  <button onClick={() => handleCopy('c06dc787e5527e89fa51d8b926404eb4951c49274a73765c52a198c9552222c8', 'sec')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-400">{cfInfo.secretKeyMasked}</div>
              </div>
            </div>

            {/* Cloudflare Worker / S3 Code Snippet */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Cloudflare Worker &amp; R2 Integration Usage:
              </span>
              <p className="text-xs text-slate-300">
                You can upload cached EPG XML files, playlist backups, and CDN channel icons directly to your Cloudflare R2 bucket:
              </p>
              <div className="p-3 rounded-lg bg-black/80 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                curl -X GET "https://api.cloudflare.com/client/v4/accounts/{cfInfo.accountId}/tokens/verify" \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer cfat_jM9de5yF6Zj6M1Pomnfmn90JLXoLZYJIUTctym7S0f44931e"
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GeoTV Space Line Details */}
        {activeTab === 'GEOTV' && (
          <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
            {/* Active Subscription Banner */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Active Subscription:</span>
                    <span className="text-cyan-300 font-sans">{geoTvInfo.package}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Next Renewal Date: <span className="text-emerald-400 font-mono font-bold">{geoTvInfo.renewal}</span> · Server Host: {geoTvInfo.host}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={geoTvInfo.cpanelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>StarIPTV CPanel</span>
                </a>
              </div>
            </div>

            {/* Line Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Server Host URL</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white">{geoTvInfo.host}</span>
                  <button onClick={() => handleCopy(geoTvInfo.host, 'h')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'h' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Username</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white">{geoTvInfo.username}</span>
                  <button onClick={() => handleCopy(geoTvInfo.username, 'u')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'u' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Password</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white">{geoTvInfo.rawPass}</span>
                  <button onClick={() => handleCopy(geoTvInfo.rawPass, 'p')} className="text-slate-400 hover:text-white">
                    {copiedKey === 'p' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Playlist Formats */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct Playlist URLs &amp; WebTV Links:
              </h3>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block">M3U Plus Playlist (TS Output)</span>
                    <span className="text-[11px] font-mono text-cyan-400 truncate block">{geoTvInfo.m3uPlus}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(geoTvInfo.m3uPlus, 'm3up')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white shrink-0 flex items-center gap-1"
                  >
                    {copiedKey === 'm3up' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block">Standard M3U (TS Output)</span>
                    <span className="text-[11px] font-mono text-slate-300 truncate block">{geoTvInfo.m3uStandard}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(geoTvInfo.m3uStandard, 'm3us')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white shrink-0 flex items-center gap-1"
                  >
                    {copiedKey === 'm3us' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block">WebTV List (MPEGTS)</span>
                    <span className="text-[11px] font-mono text-slate-300 truncate block">{geoTvInfo.webtvList}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(geoTvInfo.webtvList, 'wtv')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white shrink-0 flex items-center gap-1"
                  >
                    {copiedKey === 'wtv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Channels Parser */}
        {activeTab === 'CHANNELS' && (
          <div className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-bold text-white">
                  GeoTV Space Live Broadcast Feeds
                </h3>
                <p className="text-xs text-slate-400">
                  {channelSyncMsg || 'Stream direct from GeoTV World Package via secure HTTPS server relay.'}
                </p>
              </div>

              <button
                onClick={() => syncGeoTvChannels(true)}
                disabled={isLoadingChannels}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingChannels ? 'animate-spin' : ''}`} />
                <span>Sync Playlist Channels</span>
              </button>
            </div>

            {isLoadingChannels ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">
                  Parsing 34,000+ line M3U playlist from http://geotv.space:8880...
                </p>
              </div>
            ) : geoChannels.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Radio className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">Channels not synced yet</p>
                <button
                  onClick={() => syncGeoTvChannels(false)}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Load Channels Now
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Loaded Channels ({geoChannels.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                  {geoChannels.slice(0, 80).map((ch, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2.5 hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {ch.logo ? (
                          <img src={ch.logo} alt="" className="w-8 h-8 rounded object-cover shrink-0 bg-black/60" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">
                            TV
                          </div>
                        )}
                        <div className="truncate">
                          <span className="text-xs font-bold text-white block truncate">{ch.name}</span>
                          <span className="text-[10px] text-cyan-400 block truncate">{ch.group}</span>
                        </div>
                      </div>

                      {onPlayChannel && (
                        <button
                          onClick={() => {
                            const cObj: Channel = {
                              id: `geo_${idx}`,
                              name: ch.name,
                              number: 100 + idx,
                              logo: ch.logo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=120&h=120&q=80',
                              category: 'Entertainment',
                              country: 'Global',
                              language: 'Hindi/English',
                              streamUrl: `/api/proxy/stream?url=${encodeURIComponent(ch.streamUrl)}`,
                              epgId: `EPG_GEO_${idx}`,
                              isPremium: true,
                              isLive: true,
                              resolution: '1080p',
                              currentProgram: {
                                title: ch.name,
                                startTime: '00:00',
                                endTime: '23:59',
                                progressPercentage: 40,
                                synopsis: `Streaming live from GeoTV Space (${ch.group}).`
                              },
                              nextProgram: {
                                title: '24/7 Broadcast',
                                startTime: '00:00',
                                endTime: '00:00'
                              }
                            };
                            onPlayChannel(cObj);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 shrink-0 transition-colors"
                          title="Watch Stream"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure Cloudflare Token Relay &amp; HTTPS Video Proxy Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

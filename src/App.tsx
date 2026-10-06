import React, { useState, useEffect } from 'react';
import { 
  ApiCallLog, 
  AuditLog, 
  CreditTransaction, 
  CustomerLine, 
  LineType, 
  PlanId, 
  PLANS, 
  ProviderCreditLog, 
  ProviderInfo, 
  Role, 
  ServerConfig 
} from './types/iptv';
import { StorageService } from './services/storage';
import { 
  executeProviderCall, 
  fetchProviderCreditLogs, 
  fetchProviderInfo 
} from './services/api';

// Reseller & Admin Components
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { LineManager } from './components/LineManager';
import { PlaylistGenerator } from './components/PlaylistGenerator';
import { CreditLedger } from './components/CreditLedger';
import { ApiConsole } from './components/ApiConsole';
import { WebhookSimulator } from './components/WebhookSimulator';
import { AuditRbacViewer } from './components/AuditRbacViewer';
import { CreateLineModal } from './components/CreateLineModal';
import { LineDetailModal } from './components/LineDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { CloudflareStreamHub } from './components/admin/CloudflareStreamHub';
import { OpsRobotDashboard } from './components/admin/operations/OpsRobotDashboard';

// PlayBeat Entertainment OTT Consumer Components
import { PlayBeatHeader } from './components/playbeat/PlayBeatHeader';
import { HeroBanner } from './components/playbeat/HeroBanner';
import { HomeSections } from './components/playbeat/HomeSections';
import { LiveTvView } from './components/playbeat/LiveTvView';
import { MoviesView } from './components/playbeat/MoviesView';
import { SeriesView } from './components/playbeat/SeriesView';
import { EpgGuideView } from './components/playbeat/EpgGuideView';
import { CustomerAccountView } from './components/playbeat/CustomerAccountView';
import { PlansAndCheckoutModal } from './components/playbeat/PlansAndCheckoutModal';
import { VideoPlayerModal } from './components/playbeat/VideoPlayerModal';
import { DevicesView } from './components/playbeat/DevicesView';
import { SupportView } from './components/playbeat/SupportView';
import { SearchModal } from './components/playbeat/SearchModal';
import { CloudflareGeoTvModal } from './components/playbeat/CloudflareGeoTvModal';
import { PlayBeatLogo } from './components/common/PlayBeatLogo';

// Media Catalog & Types
import { 
  CHANNELS, 
  MOVIES, 
  SERIES, 
  PLANS as PLAYBEAT_PLANS 
} from './services/catalogData';
import { Channel, Movie, Series, Episode, SubscriptionPlan } from './types/playbeat';

import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
  Cloud
} from 'lucide-react';

export default function App() {
  // URL Routing & Indexing: 'storefront' (/ or /store) vs 'admin' (/admin)
  const getInitialRoute = (): 'storefront' | 'admin' => {
    if (typeof window === 'undefined') return 'storefront';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash === '#/admin') {
      return 'admin';
    }
    return 'storefront';
  };

  const [currentRoute, setCurrentRoute] = useState<'storefront' | 'admin'>(getInitialRoute);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pb_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const navigateTo = (target: 'storefront' | 'admin') => {
    if (target === 'admin') {
      window.history.pushState(null, '', '/admin');
      setCurrentRoute('admin');
    } else {
      window.history.pushState(null, '', '/');
      setCurrentRoute('storefront');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      setCurrentRoute(getInitialRoute());
      if (path.includes('operations') || path.includes('incidents') || path.includes('maintenance') || path.includes('broadcasts')) {
        setResellerActiveTab('operations');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // PlayBeat Consumer Navigation Section: 'home' | 'live' | 'movies' | 'series' | 'guide' | 'devices' | 'support' | 'account'
  const [streamingSection, setStreamingSection] = useState<string>('home');

  // Reseller Management Active Tab: 'dashboard' | 'operations' | 'cloudflare' | 'lines' | 'playlists' | 'ledger' | 'api-console' | 'webhook' | 'rbac'
  const [resellerActiveTab, setResellerActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('operations') || path.includes('incidents') || path.includes('maintenance') || path.includes('broadcasts')) {
        return 'operations';
      }
    }
    return 'dashboard';
  });

  // Reseller State
  const [lines, setLines] = useState<CustomerLine[]>([]);
  const [balanceCenti, setBalanceCenti] = useState<number>(108873);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiCallLog[]>([]);
  const [isSimulation, setIsSimulation] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<Role>('SUPER_ADMIN');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Provider Upstream data
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [creditLogs, setCreditLogs] = useState<ProviderCreditLog[]>([]);
  const [isLoadingProvider, setIsLoadingProvider] = useState<boolean>(false);

  // Reseller Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<LineType>('XTREAM');
  const [createModalIsTrial, setCreateModalIsTrial] = useState(false);
  const [selectedLine, setSelectedLine] = useState<CustomerLine | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // PlayBeat Consumer State
  const [activePlayingChannel, setActivePlayingChannel] = useState<Channel | null>(null);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCloudflareModalOpen, setIsCloudflareModalOpen] = useState(false);
  const [activeChannelsList, setActiveChannelsList] = useState<Channel[]>(CHANNELS);
  const [myList, setMyList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pb_my_list');
      return saved ? JSON.parse(saved) : ['Tears of Steel: Renaissance', 'PlayBeat Sports Premier 4K'];
    } catch {
      return ['Tears of Steel: Renaissance', 'PlayBeat Sports Premier 4K'];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pb_favorites');
      return saved ? JSON.parse(saved) : ['ch_pb_sports_1', 'ch_pb_cinema_action'];
    } catch {
      return ['ch_pb_sports_1', 'ch_pb_cinema_action'];
    }
  });

  // Customer Active Subscription State - Initialized with GeoTV Space Line
  const [customerSubscription, setCustomerSubscription] = useState({
    planName: 'World Package, Channels + Vods (Family)',
    status: 'ACTIVE' as 'ACTIVE' | 'TRIAL' | 'EXPIRED',
    expiryDate: '2026-11-05',
    daysRemaining: 30,
    username: '3fa35bc1',
    password: '3cc73db1',
    serverUrl: 'http://geotv.space:8880',
    playlistUrl: 'http://geotv.space:8880/get.php?username=3fa35bc1&password=3cc73db1&type=m3u_plus&output=ts',
    epgUrl: 'http://geotv.space:8880/xmltv.php?username=3fa35bc1&password=3cc73db1',
    connectionsAllowed: 4
  });

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const recordAudit = async (action: string, targetType: string, targetId: string, metadata: any = {}) => {
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: 'usr_admin_01',
          actorRole: currentRole,
          action,
          targetType,
          targetId,
          metadata
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          setAuditLogs((prev) => [data.entry, ...prev]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initial load
  useEffect(() => {
    const loadedLines = StorageService.getLines();
    const loadedBal = StorageService.getBalanceCenti();
    const loadedTx = StorageService.getTransactions();
    const loadedSrv = StorageService.getServers();
    const loadedLogs = StorageService.getApiLogs();
    const loadedSim = StorageService.isSimulationMode();
    const loadedKey = StorageService.getCustomApiKey();

    // Ensure GeoTV line is seeded
    let currentLines = [...loadedLines];
    if (!currentLines.some(l => l.providerUsername === '3fa35bc1')) {
      const geoLine: CustomerLine = {
        id: 'line_geotv_world',
        name: 'GeoTV World Package (Family)',
        lineType: 'XTREAM',
        providerUsername: '3fa35bc1',
        providerPassword: '3cc73db1',
        serverId: 'srv_geotv_01',
        plan: 1,
        bid: '[5,11]',
        connections: 4,
        status: 'ACTIVE',
        startDate: '2026-10-05',
        expiryDate: '2026-11-05',
        expirySource: 'MANUAL',
        creditCost: 1,
        addch: 1,
        addvods: 1,
        adults: 1,
        notice: 'World Package, Channels + Vods (Family) - Renewal 05-11-2026',
        suspendedLocally: false,
        createdAt: '2026-10-05T00:00:00.000Z'
      };
      currentLines = [geoLine, ...currentLines];
      StorageService.saveLines(currentLines);
    }

    // Ensure GeoTV server is seeded
    let currentSrv = [...loadedSrv];
    if (!currentSrv.some(s => s.hostUrl.includes('geotv.space'))) {
      const geoServer: ServerConfig = {
        id: 'srv_geotv_01',
        name: 'GeoTV Space High-Speed Edge (Port 8880)',
        hostUrl: 'http://geotv.space:8880',
        isDefault: true
      };
      currentSrv.forEach(s => { s.isDefault = false; });
      currentSrv = [geoServer, ...currentSrv];
      StorageService.saveServers(currentSrv);
    }

    setLines(currentLines);
    setBalanceCenti(loadedBal);
    setTransactions(loadedTx);
    setServers(currentSrv);
    setApiLogs(loadedLogs);
    setIsSimulation(loadedSim);
    setCustomApiKey(loadedKey);

    refreshProviderData(loadedSim);
    fetchAuditLogs();
  }, []);

  // Automatically fetch and embed all 850+ GeoTV live channels into active lineup
  useEffect(() => {
    let isMounted = true;
    const fetchChannels = async () => {
      try {
        let res = await fetch('/api/iptv/geotv/channels');
        if (!res.ok) {
          res = await fetch('/api/iptv/channels');
        }
        const data = await res.json();
        if (!isMounted || !data.success || !Array.isArray(data.channels)) return;

        // Map authentic broadcast channel names without any added prefix
        const geoChannels: Channel[] = data.channels.map((c: any, idx: number) => {
          const rawName = String(c.name || c.rawName || 'Live Channel').trim();
          // Clean technical provider prefixes while preserving authentic original name
          const authenticName = rawName.replace(/^(CM:\s*|IN\s*-\s*|PK\s*-\s*|EN\s*-\s*|UK\s*-\s*|SL\s*)/i, '').trim();
          const streamId = c.streamId || String(idx + 1);
          const hlsUrl = c.hlsUrl || `/api/proxy/hls/stream.m3u8?channelId=${streamId}`;
          const tsUrl = c.tsUrl || `/api/proxy/stream?url=${encodeURIComponent(c.streamUrl || '')}`;
          const rawLogo = c.logo || c.rawLogo || '';
          const logoUrl = rawLogo && rawLogo.startsWith('http://')
            ? `/api/proxy/image?url=${encodeURIComponent(rawLogo)}`
            : rawLogo;

          return {
            id: `geo_live_${idx + 1}`,
            name: authenticName,
            number: idx + 1,
            logo: logoUrl,
            category: c.category || 'Entertainment',
            country: c.group?.includes('PK') ? 'Pakistan' : c.group?.includes('IN') ? 'India' : 'Global',
            language: c.group?.includes('PK') ? 'Urdu' : c.group?.includes('IN') ? 'Hindi' : 'English',
            streamUrl: hlsUrl,
            hlsUrl: hlsUrl,
            tsUrl: tsUrl,
            streamId: streamId,
            groupTitle: c.group || 'Live Feed',
            epgId: `EPG_GEO_${idx + 1}`,
            isPremium: true,
            isLive: true,
            resolution: authenticName.includes('4K') ? '4K' : authenticName.includes('FHD') || authenticName.includes('HD') ? '1080p' : '720p',
            currentProgram: {
              title: `${authenticName} — Live Broadcast`,
              startTime: '00:00',
              endTime: '23:59',
              progressPercentage: 55,
              synopsis: `Live broadcast feed relayed via Cloudflare 1.1.1.1 DoH (${c.group || 'Live'}). Lag-free stream.`
            },
            nextProgram: {
              title: 'Live Continuous Broadcast',
              startTime: '00:00',
              endTime: '00:00'
            }
          };
        });

        // Set lineup with curated top networks and all 850+ live channels
        setActiveChannelsList([...CHANNELS, ...geoChannels]);
      } catch (err) {
        console.warn('[GeoTV Sync] Auto-fetch error:', err);
      }
    };

    fetchChannels();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save My List & Favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pb_my_list', JSON.stringify(myList));
    } catch {}
  }, [myList]);

  useEffect(() => {
    try {
      localStorage.setItem('pb_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const refreshProviderData = async (simMode = isSimulation) => {
    setIsLoadingProvider(true);
    try {
      const [infoRes, logsRes] = await Promise.all([
        fetchProviderInfo(simMode),
        fetchProviderCreditLogs(simMode)
      ]);

      if (infoRes.data) {
        setProviderInfo(infoRes.data);
      }
      if (logsRes.data && Array.isArray(logsRes.data)) {
        setCreditLogs(logsRes.data);
      }
    } catch (e) {
      console.error('Failed to sync provider data', e);
    } finally {
      setIsLoadingProvider(false);
    }
  };

  // Create line handler
  const handleCreateLine = async (lineData: Partial<CustomerLine>): Promise<boolean> => {
    const cost = lineData.creditCost || 0;
    const costCenti = cost * 100;

    if (lineData.plan !== 11 && balanceCenti < costCenti) {
      showToast('Insufficient reseller credit balance.', 'error');
      return false;
    }

    // Prepare provider call
    let opType = 'add';
    const params: Record<string, any> = {
      conx: lineData.connections,
      plan: lineData.plan,
      bid: lineData.bid,
      addch: lineData.addch ?? 1,
      addvods: lineData.addvods ?? 1,
      adults: lineData.adults ?? 0,
      notice: lineData.notice || '',
      ch: ''
    };

    if (lineData.lineType === 'XTREAM') {
      opType = 'add';
      params.user = lineData.providerUsername;
      params.pass = lineData.providerPassword;
    } else if (lineData.lineType === 'ACTIVECODE') {
      opType = 'activecode';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://playbeat.live';
      const cb = btoa(`${origin}/api/activecode/callback`);
      params.callback = cb;
      params.user = lineData.providerUsername;
    } else if (lineData.lineType === 'MAC') {
      opType = 'addmac';
      params.address = lineData.providerUsername;
      params.mac = '1';
    }

    const result = await executeProviderCall(opType, params, {
      simulateFallback: isSimulation,
      customKey: customApiKey,
      onLog: handleAddApiLog
    });

    if (result.success && result.data?.status !== 'error') {
      const expiry = StorageService.calculateExpiryDate(lineData.plan as PlanId);
      const newLine: CustomerLine = {
        id: `line_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: lineData.name!,
        lineType: lineData.lineType!,
        providerUsername: lineData.providerUsername!,
        providerPassword: lineData.providerPassword,
        serverId: lineData.serverId || servers[0]?.id || 'srv_primary_01',
        plan: lineData.plan as PlanId,
        bid: lineData.bid!,
        connections: lineData.connections || 1,
        status: lineData.plan === 11 ? 'TRIAL' : 'ACTIVE',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: expiry,
        expirySource: 'LOCAL_DERIVED',
        creditCost: cost,
        addch: lineData.addch ?? 1,
        addvods: lineData.addvods ?? 1,
        adults: lineData.adults ?? 0,
        notice: lineData.notice || '',
        suspendedLocally: false,
        createdAt: new Date().toISOString()
      };

      const updatedLines = [newLine, ...lines];
      setLines(updatedLines);
      StorageService.saveLines(updatedLines);

      if (costCenti > 0) {
        const newBal = balanceCenti - costCenti;
        StorageService.addTransaction({
          type: 'LINE_CREATION',
          amountCenti: -costCenti,
          previousBalanceCenti: balanceCenti,
          newBalanceCenti: newBal,
          reference: `New ${lineData.lineType} line: ${lineData.providerUsername} (${lineData.connections} screen)`,
          idempotencyKey: `ord_create_${Date.now()}`
        });
        setBalanceCenti(newBal);
        setTransactions(StorageService.getTransactions());
      }

      recordAudit('LINE_CREATE', lineData.lineType!, lineData.providerUsername!, {
        subscriber: lineData.name,
        plan: lineData.plan,
        conx: lineData.connections,
        creditCost: cost
      });

      showToast(`Successfully created ${lineData.lineType} line for ${lineData.name}`);
      return true;
    } else {
      const errMsg = result.data?.msg || result.error || 'Provider rejected line creation.';
      showToast(errMsg, 'error');
      return false;
    }
  };

  // Renew line handler
  const handleRenewLine = async (line: CustomerLine, planId: PlanId): Promise<boolean> => {
    const plan = PLANS[planId];
    const cost = plan.baseCredits * line.connections;
    const costCenti = cost * 100;

    if (balanceCenti < costCenti) {
      showToast('Insufficient reseller credit balance.', 'error');
      return false;
    }

    const opType =
      line.lineType === 'XTREAM'
        ? 'extend'
        : line.lineType === 'ACTIVECODE'
        ? 'extendac'
        : 'extendmac';

    const result = await executeProviderCall(
      opType,
      { user: line.providerUsername, plan: planId },
      {
        simulateFallback: isSimulation,
        customKey: customApiKey,
        onLog: handleAddApiLog
      }
    );

    if (result.success && result.data?.status !== 'error') {
      const newExpiry = StorageService.calculateExpiryDate(planId, line.expiryDate);
      const updatedLines = lines.map((l) =>
        l.id === line.id
          ? {
              ...l,
              expiryDate: newExpiry,
              status: 'ACTIVE' as const,
              lastRenewedAt: new Date().toISOString()
            }
          : l
      );

      setLines(updatedLines);
      StorageService.saveLines(updatedLines);

      const newBal = balanceCenti - costCenti;
      StorageService.addTransaction({
        type: 'RENEWAL',
        amountCenti: -costCenti,
        previousBalanceCenti: balanceCenti,
        newBalanceCenti: newBal,
        reference: `Renewed ${line.lineType}: ${line.providerUsername} (+${plan.durationLabel})`,
        idempotencyKey: `ord_renew_${Date.now()}`
      });
      setBalanceCenti(newBal);
      setTransactions(StorageService.getTransactions());

      recordAudit('LINE_RENEW', line.lineType, line.providerUsername, {
        plan: planId,
        newExpiry,
        creditCost: cost
      });

      showToast(`Extended ${line.providerUsername} to ${newExpiry}`);
      return true;
    } else {
      showToast(result.data?.msg || 'Failed to extend line.', 'error');
      return false;
    }
  };

  // Edit line handler
  const handleEditLine = async (
    line: CustomerLine,
    newValues: { newUser?: string; newPass?: string; notice?: string }
  ): Promise<boolean> => {
    const opType = line.lineType === 'MAC' ? 'editmac' : 'edit';
    const params: Record<string, any> = {
      user: line.providerUsername,
      newuser: newValues.newUser || line.providerUsername,
      notice: newValues.notice ?? line.notice,
      ch: ''
    };
    if (line.lineType === 'XTREAM') {
      params.pass = newValues.newPass || line.providerPassword;
    }

    const result = await executeProviderCall(opType, params, {
      simulateFallback: isSimulation,
      customKey: customApiKey,
      onLog: handleAddApiLog
    });

    if (result.success && result.data?.status !== 'error') {
      const updatedLines = lines.map((l) =>
        l.id === line.id
          ? {
              ...l,
              providerUsername: newValues.newUser || l.providerUsername,
              providerPassword: newValues.newPass || l.providerPassword,
              notice: newValues.notice ?? l.notice
            }
          : l
      );

      setLines(updatedLines);
      StorageService.saveLines(updatedLines);

      recordAudit('LINE_EDIT', line.lineType, line.providerUsername, {
        newUser: newValues.newUser,
        hasPasswordChange: !!newValues.newPass
      });

      showToast(`Updated line credentials for ${line.providerUsername}`);
      return true;
    } else {
      showToast(result.data?.msg || 'Failed to edit line.', 'error');
      return false;
    }
  };

  // Delete line handler
  const handleDeleteLine = async (line: CustomerLine, force: boolean): Promise<boolean> => {
    const opType =
      line.lineType === 'XTREAM'
        ? 'del'
        : line.lineType === 'ACTIVECODE'
        ? 'delac'
        : 'delmac';

    const params: Record<string, any> = {
      user: line.providerUsername
    };
    if (force) {
      params.force = '1';
    }

    const result = await executeProviderCall(opType, params, {
      simulateFallback: isSimulation,
      customKey: customApiKey,
      onLog: handleAddApiLog
    });

    if (result.success && result.data?.status !== 'error') {
      const updatedLines = lines.filter((l) => l.id !== line.id);
      setLines(updatedLines);
      StorageService.saveLines(updatedLines);

      if (force && line.plan !== 11) {
        const refundCredits = Math.max(1, Math.floor(line.creditCost * 0.5));
        const refundCenti = refundCredits * 100;
        const newBal = balanceCenti + refundCenti;

        StorageService.addTransaction({
          type: 'REFUND',
          amountCenti: refundCenti,
          previousBalanceCenti: balanceCenti,
          newBalanceCenti: newBal,
          reference: `Provider line deletion refund: ${line.providerUsername}`,
          idempotencyKey: `ord_refund_${Date.now()}`
        });
        setBalanceCenti(newBal);
        setTransactions(StorageService.getTransactions());
      }

      recordAudit('LINE_DELETE', line.lineType, line.providerUsername, { force });

      showToast(`Deleted subscription for ${line.providerUsername}`);
      return true;
    } else {
      showToast(result.data?.msg || 'Failed to delete line.', 'error');
      return false;
    }
  };

  const handleToggleSuspend = (line: CustomerLine) => {
    const updated = lines.map((l) =>
      l.id === line.id
        ? {
            ...l,
            suspendedLocally: !l.suspendedLocally,
            status: (!l.suspendedLocally ? 'SUSPENDED' : 'ACTIVE') as any
          }
        : l
    );
    setLines(updated);
    StorageService.saveLines(updated);
    showToast(
      line.suspendedLocally
        ? `Resumed local status for ${line.providerUsername}`
        : `Marked ${line.providerUsername} as locally suspended`,
      'info'
    );
  };

  const handleAddApiLog = (log: ApiCallLog) => {
    StorageService.addApiLog(log);
    setApiLogs(StorageService.getApiLogs());
  };

  const handleClearApiLogs = () => {
    StorageService.clearApiLogs();
    setApiLogs([]);
  };

  const handleToggleSimulation = (enabled: boolean) => {
    setIsSimulation(enabled);
    StorageService.setSimulationMode(enabled);
    refreshProviderData(enabled);
    showToast(
      enabled ? 'Switched to Sandbox Simulation mode.' : 'Switched to Live Provider mode.',
      'info'
    );
  };

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    StorageService.setCustomApiKey(key);
    showToast('Updated provider API credentials.', 'success');
  };

  const handleSaveServers = (newServers: ServerConfig[]) => {
    setServers(newServers);
    StorageService.saveServers(newServers);
    showToast('Updated streaming server nodes.', 'success');
  };

  const defaultServer = servers.find((s) => s.isDefault) || servers[0] || {
    id: 'srv_default',
    name: 'Primary Node',
    hostUrl: 'https://stream.playbeat.live:8080',
    isDefault: true
  };

  // PlayBeat Consumer Handlers
  const handleWatchChannel = (channel: Channel) => {
    setActivePlayingChannel(channel);
  };

  const handleWatchMovie = (movie: Movie) => {
    // Construct a synthetic Channel object for movie playback in the video player modal
    const movieChannel: Channel = {
      id: `movie_${movie.id}`,
      name: movie.title,
      number: 1,
      logo: movie.poster,
      category: 'Movies',
      country: 'Global',
      language: movie.language,
      streamUrl: movie.streamUrl,
      epgId: `EPG_MOV_${movie.id}`,
      isPremium: true,
      isLive: false,
      resolution: '4K',
      currentProgram: {
        title: movie.title,
        startTime: '00:00',
        endTime: movie.duration,
        progressPercentage: 10,
        synopsis: movie.description
      },
      nextProgram: {
        title: 'Feature Ending & Credits',
        startTime: movie.duration,
        endTime: '--:--'
      }
    };
    setActivePlayingChannel(movieChannel);
  };

  const handleSelectSeries = (series: Series) => {
    const firstEpisode = series.seasons[0]?.episodes[0];
    if (firstEpisode) {
      handlePlayEpisode(firstEpisode, series.title);
    } else {
      setStreamingSection('series');
    }
  };

  const handlePlayEpisode = (episode: Episode, seriesTitle: string) => {
    const episodeChannel: Channel = {
      id: `ep_${episode.id}`,
      name: `${seriesTitle} — S1:E${episode.episodeNumber}`,
      number: 1,
      logo: episode.thumbnail,
      category: 'Entertainment',
      country: 'Global',
      language: 'English',
      streamUrl: episode.streamUrl,
      epgId: `EPG_EP_${episode.id}`,
      isPremium: true,
      isLive: false,
      resolution: '4K',
      currentProgram: {
        title: episode.title,
        startTime: '00:00',
        endTime: episode.duration,
        progressPercentage: 15,
        synopsis: episode.synopsis
      },
      nextProgram: {
        title: 'Next Episode Autoplay',
        startTime: episode.duration,
        endTime: '--:--'
      }
    };
    setActivePlayingChannel(episodeChannel);
  };

  const handleToggleMyList = (title: string) => {
    if (myList.includes(title)) {
      setMyList(myList.filter((item) => item !== title));
      showToast(`Removed "${title}" from My List`, 'info');
    } else {
      setMyList([...myList, title]);
      showToast(`Saved "${title}" to My List`, 'success');
    }
  };

  const handleToggleFavorite = (channelId: string) => {
    if (favorites.includes(channelId)) {
      setFavorites(favorites.filter((id) => id !== channelId));
    } else {
      setFavorites([...favorites, channelId]);
    }
  };

  const handleSubscriptionActivated = (plan: SubscriptionPlan, credentials: any) => {
    const host = defaultServer?.hostUrl || 'https://stream.playbeat.live:8080';
    const user = credentials.username || `pb_vip_${Math.random().toString(36).substring(2, 7)}`;
    const pass = credentials.password || 'playbeat2026';

    setCustomerSubscription({
      planName: plan.name,
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 30,
      username: user,
      password: pass,
      serverUrl: host,
      playlistUrl: `${host}/get.php?username=${user}&password=${pass}&type=m3u_plus&output=ts`,
      epgUrl: `${host}/xmltv.php?username=${user}&password=${pass}`,
      connectionsAllowed: plan.connectionLimit
    });

    // Also auto-provision in lines array for the Reseller/Admin panel
    const newLine: CustomerLine = {
      id: `line_online_${Date.now()}`,
      name: credentials.name || `Online Customer (${plan.name})`,
      lineType: 'XTREAM',
      providerUsername: user,
      providerPassword: pass,
      serverId: defaultServer.id,
      plan: 1,
      bid: '[5,11]',
      connections: plan.connectionLimit,
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expirySource: 'LOCAL_DERIVED',
      creditCost: 1,
      addch: 1,
      addvods: 1,
      adults: 0,
      notice: `Web Sales Checkout (${credentials.paymentMethod || 'Direct'})`,
      suspendedLocally: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newLine, ...lines];
    setLines(updated);
    StorageService.saveLines(updated);

    showToast(`VIP Plan ${plan.name} activated! Credentials generated.`, 'success');
  };

  // Switch to Reseller / Admin handler
  const handleSwitchToResellerOrAdmin = (targetRole: Role = 'SUPER_ADMIN') => {
    setCurrentRole(targetRole);
    navigateTo('admin');
    setResellerActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Navigated to PlayBeat Admin Console (${targetRole})`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border bg-slate-900 border-slate-700 text-xs text-white animate-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          MODE 1: PLAYBEAT ENTERTAINMENT CONSUMER STREAMING PLATFORM
          ======================================================== */}
      {currentRoute === 'storefront' ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <PlayBeatHeader
            activeSection={streamingSection}
            onNavigate={(sec) => {
              setStreamingSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            myListCount={myList.length}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onNavigateToAdmin={() => navigateTo('admin')}
          />

          {/* Subheader / Open Storefront Badge */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-slate-950 border-b border-emerald-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">PLAYBEAT ENTERTAIN:</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">100% Free Live Streaming Feeds</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-cyan-300 hidden sm:inline">No Subscription Required · 850+ Live Channels</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStreamingSection('live');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
              >
                <Tv className="w-3 h-3 text-cyan-400" />
                <span>Watch Free Live TV</span>
              </button>
            </div>
          </div>

          {/* Content Body Based on Navigation */}
          <main className="flex-1 pb-16">
            {streamingSection === 'home' && (
              <>
                <HeroBanner
                  onWatchLive={() => {
                    const sportsCh = activeChannelsList.find((c) => c.category === 'Sports') || activeChannelsList[0];
                    handleWatchChannel(sportsCh);
                  }}
                  onOpenPlans={() => setIsPlansModalOpen(true)}
                  onWatchItem={(streamUrl, title, logo) => {
                    const tempCh: Channel = {
                      id: `temp_${Date.now()}`,
                      name: title,
                      number: 1,
                      logo: logo || activeChannelsList[0].logo,
                      category: 'Entertainment',
                      country: 'Global',
                      language: 'English',
                      streamUrl: streamUrl,
                      epgId: 'EPG_HERO',
                      isPremium: true,
                      isLive: false,
                      resolution: '4K',
                      currentProgram: {
                        title: title,
                        startTime: '00:00',
                        endTime: '02:00',
                        progressPercentage: 5,
                        synopsis: 'PlayBeat Original Presentation.'
                      },
                      nextProgram: {
                        title: 'Live Post-Show',
                        startTime: '02:00',
                        endTime: '03:00'
                      }
                    };
                    setActivePlayingChannel(tempCh);
                  }}
                  onToggleMyList={handleToggleMyList}
                  isItemInMyList={(title) => myList.includes(title)}
                />

                <HomeSections
                  channels={activeChannelsList}
                  movies={MOVIES}
                  series={SERIES}
                  onWatchChannel={handleWatchChannel}
                  onWatchMovie={handleWatchMovie}
                  onSelectSeries={handleSelectSeries}
                  onToggleMyList={handleToggleMyList}
                  isItemInMyList={(title) => myList.includes(title)}
                  onNavigateSection={(sec) => {
                    setStreamingSection(sec);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            )}

            {streamingSection === 'live' && (
              <LiveTvView
                channels={activeChannelsList}
                onWatchChannel={handleWatchChannel}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {streamingSection === 'movies' && (
              <MoviesView
                movies={MOVIES}
                onWatchMovie={handleWatchMovie}
                onToggleMyList={handleToggleMyList}
                isItemInMyList={(title) => myList.includes(title)}
              />
            )}

            {streamingSection === 'series' && (
              <SeriesView
                seriesList={SERIES}
                onPlayEpisode={(ep, title) => handlePlayEpisode(ep, title)}
              />
            )}

            {streamingSection === 'guide' && (
              <EpgGuideView
                channels={activeChannelsList}
                onWatchChannel={handleWatchChannel}
              />
            )}

            {streamingSection === 'devices' && (
              <DevicesView
                onOpenPlans={() => setIsPlansModalOpen(true)}
                serverUrl={customerSubscription.serverUrl}
                username={customerSubscription.username}
                password={customerSubscription.password}
                m3uUrl={customerSubscription.playlistUrl}
              />
            )}

            {streamingSection === 'support' && (
              <SupportView
                onOpenPlans={() => setIsPlansModalOpen(true)}
              />
            )}

            {streamingSection === 'account' && (
              <CustomerAccountView
                subscription={customerSubscription}
                onRenew={() => setIsPlansModalOpen(true)}
                myList={myList}
              />
            )}
          </main>

          {/* PlayBeat Entertainment Footer */}
          <footer className="border-t border-white/[0.08] bg-[#03060d] text-slate-400 py-12 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
                <div>
                  <PlayBeatLogo size="md" />
                  <p className="text-xs text-slate-400 mt-2 max-w-md">
                    Entertainment Without Limits. High-performance authorized live television, 4K sports streams, cinema VOD, and reseller infrastructure.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <button onClick={() => setStreamingSection('live')} className="hover:text-cyan-400 transition-colors">
                    Live Channels
                  </button>
                  <button onClick={() => setStreamingSection('movies')} className="hover:text-cyan-400 transition-colors">
                    Movies
                  </button>
                  <button onClick={() => setStreamingSection('series')} className="hover:text-cyan-400 transition-colors">
                    Series
                  </button>
                  <button onClick={() => setStreamingSection('guide')} className="hover:text-cyan-400 transition-colors">
                    TV Guide
                  </button>
                  <button onClick={() => setStreamingSection('devices')} className="hover:text-cyan-400 transition-colors">
                    Device Setup
                  </button>
                  <button onClick={() => setStreamingSection('support')} className="hover:text-cyan-400 transition-colors">
                    Help Center
                  </button>
                  <button onClick={() => navigateTo('admin')} className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3" />
                    <span>Admin Portal (/admin)</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    PlayBeat Entertainment broadcasts authorized, licensed, and open creative commons live feeds and cinema works.
                  </span>
                </div>
                <span>
                  © 2026 PlayBeat Entertainment Inc. All rights reserved.
                </span>
              </div>
            </div>
          </footer>
        </div>
      ) : !isAdminAuthenticated ? (
        /* ========================================================
           ADMIN GATEWAY: SECURE LOGIN
           ======================================================== */
        <AdminLoginView
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            sessionStorage.setItem('pb_admin_auth', 'true');
            showToast('Signed in to PlayBeat Admin Console', 'success');
          }}
          onBackToStorefront={() => navigateTo('storefront')}
        />
      ) : (
        /* ========================================================
           MODE 2: PLAYBEAT RESELLER MANAGEMENT & ADMIN SUITE
           ======================================================== */
        <div className="flex-1 flex flex-col">
          {/* Top Switcher Ribbon */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 px-4 py-2.5 text-xs text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigateTo('storefront');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md font-semibold text-cyan-300 transition-all hover:scale-105"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to PLAYBEAT ENTERTAIN (Storefront)</span>
              </button>

              <span className="hidden md:inline text-indigo-300 font-semibold">
                Control Center: <span className="text-white uppercase font-mono">{currentRole}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-indigo-200">Switch Role:</span>
              {(['SUPER_ADMIN', 'MASTER_RESELLER', 'RESELLER', 'SUPPORT'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    showToast(`Active role set to ${r}`, 'info');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                    currentRole === r
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}

              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  sessionStorage.removeItem('pb_admin_auth');
                  showToast('Signed out of Admin Console', 'info');
                }}
                className="ml-2 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Reseller TopNav Bar */}
          <TopNav
            activeTab={resellerActiveTab}
            onTabChange={setResellerActiveTab}
            balanceCenti={balanceCenti}
            isSimulation={isSimulation}
            currentRole={currentRole}
            onOpenCreateModal={() => {
              setCreateModalType('XTREAM');
              setCreateModalIsTrial(false);
              setIsCreateModalOpen(true);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Reseller Content Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
            {resellerActiveTab === 'dashboard' && (
              <Dashboard
                lines={lines}
                balanceCenti={balanceCenti}
                providerInfo={providerInfo}
                creditLogs={creditLogs}
                isLoadingProvider={isLoadingProvider}
                onRefreshProvider={() => refreshProviderData(isSimulation)}
                onOpenCreateModal={(type = 'XTREAM', isTrial = false) => {
                  setCreateModalType(type);
                  setCreateModalIsTrial(isTrial);
                  setIsCreateModalOpen(true);
                }}
                onSelectLine={(line) => {
                  setSelectedLine(line);
                  setIsDetailModalOpen(true);
                }}
                onViewAllLines={() => setResellerActiveTab('lines')}
                onViewLedger={() => setResellerActiveTab('ledger')}
              />
            )}

            {resellerActiveTab === 'operations' && (
              <OpsRobotDashboard />
            )}

            {resellerActiveTab === 'cloudflare' && (
              <CloudflareStreamHub
                onPlayChannel={handleWatchChannel}
                onRefreshAllChannels={() => {
                  fetch('/api/iptv/geotv/channels')
                    .then(r => r.json())
                    .then(d => {
                      if (d.success && Array.isArray(d.channels)) {
                        showToast(`Refreshed ${d.channels.length} live channels`, 'success');
                      }
                    });
                }}
              />
            )}

            {resellerActiveTab === 'lines' && (
              <LineManager
                lines={lines}
                servers={servers}
                onOpenCreateModal={(type = 'XTREAM') => {
                  setCreateModalType(type);
                  setCreateModalIsTrial(false);
                  setIsCreateModalOpen(true);
                }}
                onSelectLine={(line) => {
                  setSelectedLine(line);
                  setIsDetailModalOpen(true);
                }}
                onOpenRenewModal={(line) => {
                  setSelectedLine(line);
                  setIsDetailModalOpen(true);
                }}
                onOpenEditModal={(line) => {
                  setSelectedLine(line);
                  setIsDetailModalOpen(true);
                }}
                onOpenDeleteModal={(line) => {
                  setSelectedLine(line);
                  setIsDetailModalOpen(true);
                }}
                onToggleSuspend={handleToggleSuspend}
              />
            )}

            {resellerActiveTab === 'playlists' && (
              <PlaylistGenerator lines={lines} servers={servers} />
            )}

            {resellerActiveTab === 'ledger' && (
              <CreditLedger
                transactions={transactions}
                balanceCenti={balanceCenti}
                providerCreditStr={providerInfo?.user_credit}
                onBalanceUpdated={() => {
                  setBalanceCenti(StorageService.getBalanceCenti());
                  setTransactions(StorageService.getTransactions());
                }}
              />
            )}

            {resellerActiveTab === 'api-console' && (
              <ApiConsole
                apiLogs={apiLogs}
                onLogAdded={handleAddApiLog}
                onClearLogs={handleClearApiLogs}
                isSimulation={isSimulation}
                customApiKey={customApiKey}
              />
            )}

            {resellerActiveTab === 'webhook' && (
              <WebhookSimulator lines={lines} />
            )}

            {resellerActiveTab === 'rbac' && (
              <AuditRbacViewer
                currentRole={currentRole}
                onRoleChange={(r) => {
                  setCurrentRole(r);
                  showToast(`Active role switched to ${r}`, 'info');
                }}
                auditLogs={auditLogs}
                onRefreshAudit={fetchAuditLogs}
              />
            )}
          </main>

          {/* Reseller Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 px-4 lg:px-8 py-4 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>PlayBeat Reseller Management Console · Xtream Masters API Version 3.0</span>
              <span className="font-mono text-[11px] text-slate-400">
                Double-Entry Ledger · AES-GCM Encrypted Credentials
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* ========================================================
          GLOBAL MODALS (Used across both Streaming & Reseller)
          ======================================================== */}
      {/* 1. Video Player Modal (for 4K streaming of channels, movies, series) */}
      <VideoPlayerModal
        channel={activePlayingChannel}
        allChannels={activeChannelsList}
        isOpen={!!activePlayingChannel}
        onClose={() => setActivePlayingChannel(null)}
        onSelectChannel={(ch) => setActivePlayingChannel(ch)}
        isFavorite={activePlayingChannel ? favorites.includes(activePlayingChannel.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 2. Packages & Checkout Modal */}
      <PlansAndCheckoutModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        onSubscriptionActivated={handleSubscriptionActivated}
      />

      {/* 3. Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        channels={activeChannelsList}
        movies={MOVIES}
        series={SERIES}
        onWatchChannel={handleWatchChannel}
        onWatchMovie={handleWatchMovie}
        onSelectSeries={handleSelectSeries}
      />

      {/* 4. Reseller Create Line Modal */}
      <CreateLineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        servers={servers}
        balanceCenti={balanceCenti}
        initialType={createModalType}
        initialIsTrial={createModalIsTrial}
        onSubmit={handleCreateLine}
      />

      {/* 5. Reseller Line Detail Modal */}
      <LineDetailModal
        line={selectedLine}
        server={defaultServer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onRenew={handleRenewLine}
        onEdit={handleEditLine}
        onDelete={handleDeleteLine}
        onToggleSuspend={handleToggleSuspend}
      />

      {/* 6. Reseller Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        servers={servers}
        onSaveServers={handleSaveServers}
        isSimulation={isSimulation}
        onToggleSimulation={handleToggleSimulation}
        customApiKey={customApiKey}
        onSaveCustomApiKey={handleSaveCustomKey}
      />

      {/* 7. Cloudflare & GeoTV Integration Modal */}
      <CloudflareGeoTvModal
        isOpen={isCloudflareModalOpen}
        onClose={() => setIsCloudflareModalOpen(false)}
        onPlayChannel={(ch) => setActivePlayingChannel(ch)}
        onLoadLiveChannels={(synced) => {
          setActiveChannelsList(prev => [...synced, ...prev]);
        }}
      />
    </div>
  );
}

import { ApiCallLog, CreditTransaction, CustomerLine, PlanId, ServerConfig } from '../types/iptv';

const STORAGE_KEYS = {
  LINES: 'star_iptv_lines_v1',
  BALANCE: 'star_iptv_balance_centi_v1',
  TRANSACTIONS: 'star_iptv_transactions_v1',
  SERVERS: 'star_iptv_servers_v1',
  API_LOGS: 'star_iptv_api_logs_v1',
  SIMULATION_MODE: 'star_iptv_sim_mode_v1',
  CUSTOM_KEY: 'star_iptv_custom_key_v1'
};

const DEFAULT_SERVERS: ServerConfig[] = [
  {
    id: 'srv_primary_01',
    name: 'Primary EU CDN (Ultra High Speed)',
    hostUrl: 'http://cdn-stream.starpanel.tv:8080',
    playerUrl: 'http://cdn-stream.starpanel.tv:8080/app.php',
    isDefault: true
  },
  {
    id: 'srv_us_backup',
    name: 'US East Edge Node (Low Latency)',
    hostUrl: 'http://us-east.starpanel.tv:8000',
    playerUrl: 'http://us-east.starpanel.tv:8000/app.php',
    isDefault: false
  }
];

const INITIAL_LINES: CustomerLine[] = [
  {
    id: 'line_xtr_101',
    name: 'Marcus Vance',
    lineType: 'XTREAM',
    providerUsername: 'marcus_vance',
    providerPassword: 'StreamPass982',
    serverId: 'srv_primary_01',
    plan: 1,
    bid: '[5,11]',
    connections: 2,
    status: 'ACTIVE',
    startDate: '2026-09-15',
    expiryDate: '2026-10-15',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 2,
    addch: 1,
    addvods: 1,
    adults: 0,
    notice: 'Family living room + Master bedroom',
    suspendedLocally: false,
    createdAt: '2026-09-15T10:00:00.000Z'
  },
  {
    id: 'line_xtr_102',
    name: 'Elena Rostova',
    lineType: 'XTREAM',
    providerUsername: 'elena_live_4k',
    providerPassword: 'KodiAccess_2026',
    serverId: 'srv_primary_01',
    plan: 4,
    bid: '[4,7]',
    connections: 1,
    status: 'ACTIVE',
    startDate: '2026-01-10',
    expiryDate: '2027-01-10',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 10,
    addch: 1,
    addvods: 1,
    adults: 1,
    notice: 'Annual VIP customer with adult package',
    suspendedLocally: false,
    createdAt: '2026-01-10T14:22:00.000Z'
  },
  {
    id: 'line_ac_201',
    name: 'David Chen',
    lineType: 'ACTIVECODE',
    providerUsername: '928374829104',
    providerPassword: 'TVSTARIPTV',
    serverId: 'srv_primary_01',
    plan: 2,
    bid: '[1232,1234]',
    connections: 1,
    status: 'ACTIVE',
    startDate: '2026-08-01',
    expiryDate: '2026-11-01',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 3,
    addch: 1,
    addvods: 1,
    adults: 0,
    notice: 'Android TV Star IPTV APK install',
    suspendedLocally: false,
    createdAt: '2026-08-01T09:12:00.000Z'
  },
  {
    id: 'line_mac_301',
    name: 'Tariq Al-Mansoor',
    lineType: 'MAC',
    providerUsername: '00:1A:79:B4:C2:11',
    serverId: 'srv_primary_01',
    plan: 3,
    bid: '[5,11]',
    connections: 1,
    status: 'ACTIVE',
    startDate: '2026-05-20',
    expiryDate: '2026-11-20',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 5,
    addch: 1,
    addvods: 1,
    adults: 0,
    notice: 'MAG 524w3 Set Top Box in Salon',
    suspendedLocally: false,
    createdAt: '2026-05-20T18:40:00.000Z'
  },
  {
    id: 'line_xtr_103',
    name: 'Liam O\'Connor (Trial)',
    lineType: 'XTREAM',
    providerUsername: 'liam_trial_test',
    providerPassword: 'QuickTrial24',
    serverId: 'srv_primary_01',
    plan: 11,
    bid: '[5,11]',
    connections: 1,
    status: 'TRIAL',
    startDate: '2026-10-05',
    expiryDate: '2026-10-06',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 0,
    addch: 1,
    addvods: 1,
    adults: 0,
    notice: '24h prospective customer trial via Telegram',
    suspendedLocally: false,
    createdAt: '2026-10-05T12:00:00.000Z'
  },
  {
    id: 'line_xtr_104',
    name: 'Sophia Martinez',
    lineType: 'XTREAM',
    providerUsername: 'sophia_m_exp',
    providerPassword: 'ExpiredPass123',
    serverId: 'srv_primary_01',
    plan: 1,
    bid: '[5,11]',
    connections: 1,
    status: 'EXPIRED',
    startDate: '2026-08-01',
    expiryDate: '2026-09-01',
    expirySource: 'LOCAL_DERIVED',
    creditCost: 1,
    addch: 1,
    addvods: 0,
    adults: 0,
    notice: 'Pending renewal follow-up',
    suspendedLocally: false,
    createdAt: '2026-08-01T08:00:00.000Z'
  }
];

const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'ctx_init_seed_01',
    type: 'CREDIT_PURCHASE',
    amountCenti: 110000, // +1100.00 credits
    previousBalanceCenti: 0,
    newBalanceCenti: 110000,
    reference: 'Wholesale Reseller Credit Refill (Invoice #INV-9921)',
    createdAt: '2026-09-01T08:00:00.000Z',
    idempotencyKey: 'idem_seed_01'
  },
  {
    id: 'ctx_init_seed_02',
    type: 'LINE_CREATION',
    amountCenti: -200, // -2.00 credits
    previousBalanceCenti: 110000,
    newBalanceCenti: 109800,
    reference: 'New Xtream line: marcus_vance (1 Mo x 2 conn)',
    createdAt: '2026-09-15T10:00:00.000Z',
    idempotencyKey: 'idem_seed_02'
  },
  {
    id: 'ctx_init_seed_03',
    type: 'LINE_CREATION',
    amountCenti: -1000, // -10.00 credits
    previousBalanceCenti: 109800,
    newBalanceCenti: 108800,
    reference: 'New Xtream line: elena_live_4k (12 Mo x 1 conn)',
    createdAt: '2026-09-20T14:22:00.000Z',
    idempotencyKey: 'idem_seed_03'
  },
  {
    id: 'ctx_init_seed_04',
    type: 'ADMIN_ADJUSTMENT',
    amountCenti: 73, // +0.73 credits alignment
    previousBalanceCenti: 108800,
    newBalanceCenti: 108873,
    reference: 'Provider reconciliation audit balance synchronization',
    createdAt: '2026-10-01T12:00:00.000Z',
    idempotencyKey: 'idem_seed_04'
  }
];

export class StorageService {
  static getLines(): CustomerLine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(INITIAL_LINES));
        return INITIAL_LINES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LINES;
    }
  }

  static saveLines(lines: CustomerLine[]): void {
    localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(lines));
  }

  static getBalanceCenti(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BALANCE);
      if (val === null) {
        const initial = 108873; // 1088.73 credits
        localStorage.setItem(STORAGE_KEYS.BALANCE, String(initial));
        return initial;
      }
      return parseInt(val, 10) || 0;
    } catch {
      return 108873;
    }
  }

  static setBalanceCenti(newBalanceCenti: number): void {
    localStorage.setItem(STORAGE_KEYS.BALANCE, String(newBalanceCenti));
  }

  static getTransactions(): CreditTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  static addTransaction(tx: Omit<CreditTransaction, 'id' | 'createdAt'>): CreditTransaction {
    const transactions = this.getTransactions();
    const newTx: CreditTransaction = {
      ...tx,
      id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    this.setBalanceCenti(tx.newBalanceCenti);
    return newTx;
  }

  static getServers(): ServerConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(DEFAULT_SERVERS));
        return DEFAULT_SERVERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SERVERS;
    }
  }

  static saveServers(servers: ServerConfig[]): void {
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(servers));
  }

  static getApiLogs(): ApiCallLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.API_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addApiLog(log: ApiCallLog): void {
    try {
      const logs = this.getApiLogs();
      logs.unshift(log);
      if (logs.length > 100) logs.pop();
      localStorage.setItem(STORAGE_KEYS.API_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save log', e);
    }
  }

  static clearApiLogs(): void {
    localStorage.removeItem(STORAGE_KEYS.API_LOGS);
  }

  static isSimulationMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIMULATION_MODE) === 'true';
  }

  static setSimulationMode(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEYS.SIMULATION_MODE, String(enabled));
  }

  static getCustomApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_KEY) || '';
  }

  static setCustomApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_KEY, key);
  }

  // Calculate local expiration date based on plan & existing date
  static calculateExpiryDate(plan: PlanId, currentExpiryDate?: string): string {
    const now = new Date();
    let baseDate = now;

    if (currentExpiryDate) {
      const parsed = new Date(currentExpiryDate);
      if (!isNaN(parsed.getTime()) && parsed > now) {
        baseDate = parsed;
      }
    }

    if (plan === 11) {
      // 24 Hour trial
      const trialExp = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return trialExp.toISOString().split('T')[0];
    }

    const monthsToAdd = plan === 1 ? 1 : plan === 2 ? 3 : plan === 3 ? 6 : plan === 4 ? 12 : 1;
    const exp = new Date(baseDate.getTime());
    exp.setMonth(exp.getMonth() + monthsToAdd);

    return exp.toISOString().split('T')[0];
  }
}

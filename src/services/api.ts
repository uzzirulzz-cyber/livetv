import { ApiCallLog, ProviderCreditLog, ProviderInfo } from '../types/iptv';

export interface ProviderCallResult<T = any> {
  success: boolean;
  source: 'live_provider' | 'sandbox_simulation';
  data?: T;
  rawResponse?: string;
  error?: string;
  durationMs: number;
  cUrlPost: string;
  cUrlGet: string;
}

const PROVIDER_URL = 'https://iptv-api.xtream-masters.com/v3/';

// Generate cURL commands for documentation and direct terminal verification
export function generateCurlCommands(
  type: string,
  params: Record<string, any>,
  apiKey = 'special-key'
): { post: string; get: string } {
  const queryParams = new URLSearchParams();
  queryParams.append('apikey', apiKey);

  const entries: [string, any][] = Object.entries(params);
  for (const [k, v] of entries) {
    if (v !== undefined && v !== null) {
      queryParams.append(k, String(v));
    }
  }
  queryParams.append('type', type);

  const getUrl = `${PROVIDER_URL}?${queryParams.toString()}`;
  const getCmd = `curl -X GET "${getUrl}"`;

  const bodyParts = queryParams.toString();
  const postCmd = `curl -X POST "${PROVIDER_URL}" \\\n  -d '${bodyParts}'`;

  return { post: postCmd, get: getCmd };
}

// Call the proxy server
export async function executeProviderCall<T = any>(
  type: string,
  params: Record<string, any> = {},
  options: {
    simulateFallback?: boolean;
    customKey?: string;
    onLog?: (log: ApiCallLog) => void;
  } = {}
): Promise<ProviderCallResult<T>> {
  const startTime = Date.now();
  const curls = generateCurlCommands(type, params, options.customKey || 'special-key');

  try {
    const response = await fetch('/api/provider/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        simulateFallback: options.simulateFallback,
        customKey: options.customKey,
        ...params
      })
    });

    const durationMs = Date.now() - startTime;
    const result = await response.json();

    const success = result.success !== false;
    const source = result.source || (options.simulateFallback ? 'sandbox_simulation' : 'live_provider');

    if (options.onLog) {
      options.onLog({
        id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        operation: type,
        method: 'POST',
        endpoint: PROVIDER_URL,
        status: success ? 'SUCCESS' : 'ERROR',
        durationMs,
        maskedPayload: { type, ...params, apikey: '••••••••' },
        response: result.data || result.rawResponse || result.error,
        source
      });
    }

    return {
      success,
      source,
      data: result.data,
      rawResponse: result.rawResponse,
      error: result.error,
      durationMs,
      cUrlPost: curls.post,
      cUrlGet: curls.get
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    const errorMsg = err.message || 'Client fetch error';

    if (options.onLog) {
      options.onLog({
        id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        operation: type,
        method: 'POST',
        endpoint: PROVIDER_URL,
        status: 'NETWORK_ERROR',
        durationMs,
        maskedPayload: { type, ...params, apikey: '••••••••' },
        response: { error: errorMsg },
        source: 'live_provider'
      });
    }

    return {
      success: false,
      source: 'live_provider',
      error: errorMsg,
      durationMs,
      cUrlPost: curls.post,
      cUrlGet: curls.get
    };
  }
}

// Fetch provider account status
export async function fetchProviderInfo(simulate = false): Promise<ProviderCallResult<ProviderInfo>> {
  return executeProviderCall<ProviderInfo>('infoapi', {}, { simulateFallback: simulate });
}

// Fetch provider credit history
export async function fetchProviderCreditLogs(simulate = false): Promise<ProviderCallResult<ProviderCreditLog[]>> {
  return executeProviderCall<ProviderCreditLog[]>('credit_logs', {}, { simulateFallback: simulate });
}

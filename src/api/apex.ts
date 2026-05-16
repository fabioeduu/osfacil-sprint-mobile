import axios from 'axios';
import { api } from './api';

const apexApi = axios.create({
  baseURL: 'https://oracleapex.com/ords/osfacill',
  timeout: 60000,
});

export type ApexOrdemStatusItem = {
  STATUS: string;
  TOTAL: number;
};

export type ApexStatusSource = 'main-api' | 'apex';

export type ApexOrdensStatusResponse = {
  items: ApexOrdemStatusItem[];
  apexOnline: boolean;
  updatedAt: string;
  source: ApexStatusSource;
};

type RawApexOrdemStatusItem = Record<string, unknown>;

type RawOrdemServicoItem = Record<string, unknown>;

function normalizeStatusValue(rawStatus: unknown): string {
  if (typeof rawStatus !== 'string') return 'Sem status';

  const trimmed = rawStatus.trim();
  if (!trimmed || /^sem[_\s-]?status$/i.test(trimmed)) return 'Sem status';

  return trimmed.replace(/_/g, ' ');
}

function normalizeTotalValue(rawTotal: unknown): number {
  if (typeof rawTotal === 'number' && Number.isFinite(rawTotal)) return rawTotal;

  if (typeof rawTotal === 'string') {
    const parsed = Number(rawTotal);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function normalizeApexStatusItem(item: RawApexOrdemStatusItem): ApexOrdemStatusItem {
  const rawStatus =
    item.STATUS ?? item.status ?? item.Status ?? item.SITUACAO ?? item.situacao ?? item.state;
  const rawTotal = item.TOTAL ?? item.total ?? item.Total ?? item.quantidade ?? item.QTD ?? item.count;

  return {
    STATUS: normalizeStatusValue(rawStatus),
    TOTAL: normalizeTotalValue(rawTotal),
  };
}

function extractOrdensFromResponse(data: unknown): RawOrdemServicoItem[] {
  if (Array.isArray(data)) return data as RawOrdemServicoItem[];

  if (data && typeof data === 'object') {
    const payload = data as Record<string, unknown>;

    if (Array.isArray(payload.content)) return payload.content as RawOrdemServicoItem[];
    if (Array.isArray(payload.ordemServicos)) return payload.ordemServicos as RawOrdemServicoItem[];

    const embedded = payload._embedded;
    if (embedded && typeof embedded === 'object') {
      const embeddedPayload = embedded as Record<string, unknown>;
      if (Array.isArray(embeddedPayload.ordemServicos)) {
        return embeddedPayload.ordemServicos as RawOrdemServicoItem[];
      }
    }
  }

  return [];
}

function aggregateStatusFromOrdens(ordens: RawOrdemServicoItem[]): ApexOrdemStatusItem[] {
  const counter = new Map<string, number>();

  for (const ordem of ordens) {
    const status = normalizeStatusValue(ordem.status ?? ordem.STATUS);
    counter.set(status, (counter.get(status) ?? 0) + 1);
  }

  return Array.from(counter.entries())
    .map(([STATUS, TOTAL]) => ({ STATUS, TOTAL }))
    .sort((a, b) => b.TOTAL - a.TOTAL);
}

async function getStatusFromMainApi(): Promise<ApexOrdemStatusItem[]> {
  const response = await api.get('/ordem-servicos');
  const ordens = extractOrdensFromResponse(response.data);
  return aggregateStatusFromOrdens(ordens);
}

export async function checkApexConnectivity(): Promise<boolean> {
  try {
    const response = await apexApi.get('/ordens/status', { timeout: 8000 });
    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
}

export async function getApexOrdensStatus(): Promise<ApexOrdensStatusResponse> {
  const updatedAt = new Date().toISOString();
  const apexOnline = await checkApexConnectivity();

  try {
    const mainApiItems = await getStatusFromMainApi();
    return {
      items: mainApiItems,
      apexOnline,
      updatedAt,
      source: 'main-api',
    };
  } catch {
    try {
    const response = await apexApi.get('/ordens/status');

    if (!response.data?.items || !Array.isArray(response.data.items)) {
      console.log('Sem dados na API');
        return {
          items: [],
          apexOnline,
          updatedAt,
          source: 'apex',
        };
    }

      return {
        items: response.data.items.map((item: RawApexOrdemStatusItem) => normalizeApexStatusItem(item)),
        apexOnline: true,
        updatedAt,
        source: 'apex',
      };
    } catch (error: any) {
      console.error('Erro API:', error.message);
      throw new Error('Nao foi possivel carregar os dados de status.');
    }
  }
}
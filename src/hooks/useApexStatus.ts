import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApexOrdensStatusResponse, getApexOrdensStatus } from '../api/apex';

const APEX_STATUS_QUERY_KEY = ['apex-ordens-status'];

export function useApexStatus() {
  const query = useQuery<ApexOrdensStatusResponse>({
    queryKey: APEX_STATUS_QUERY_KEY,
    queryFn: getApexOrdensStatus,
  });

  const error = useMemo(() => {
    if (!query.error) return null;
    return 'Nao foi possivel carregar os dados do APEX.';
  }, [query.error]);

  return {
    statusItems: query.data?.items ?? [],
    apexOnline: query.data?.apexOnline ?? null,
    updatedAt: query.data?.updatedAt ?? null,
    source: query.data?.source ?? null,
    loading: query.isLoading,
    error,
    reload: query.refetch,
  };
}

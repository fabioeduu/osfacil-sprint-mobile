import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmail, isAdmin } from './useAuth';
import { OrdemServico } from '../types';

const ORDENS_KEY = '@osfacil:ordens';

function genId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function useOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(ORDENS_KEY);
      const data: OrdemServico[] = json ? JSON.parse(json) : [];
      // apply role-based filtering: admins see all, users see only orders they created
      try {
        const admin = await isAdmin();
        if (admin) {
          setOrdens(data.reverse());
        } else {
          const email = await getEmail();
          if (email) {
            const filtered = data.filter(d => (d.ownerEmail || '').toLowerCase() === email.toLowerCase());
            setOrdens(filtered.reverse());
          } else {
            setOrdens([]);
          }
        }
      } catch (e) {
        setOrdens(data.reverse());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (data: OrdemServico[]) => {
    await AsyncStorage.setItem(ORDENS_KEY, JSON.stringify(data));
  }, []);

  const criar = useCallback(async (p: Partial<OrdemServico>) => {
    const json = await AsyncStorage.getItem(ORDENS_KEY);
    const list: OrdemServico[] = json ? JSON.parse(json) : [];
    const nextNumero = (list.reduce((max, o) => Math.max(max, o.numero || 0), 0) || 0) + 1;
    const servicos = (p.servicos || []) as any[];
    const valorTotal = servicos.reduce((s, it) => s + (Number(it.valor) || 0), 0);
    const owner = await getEmail();
    const ordem: OrdemServico = {
      id: genId(),
      numero: nextNumero,
      clienteId: p.clienteId,
      veiculoId: p.veiculoId,
      dataAbertura: new Date().toISOString(),
      status: (p.status as any) || 'ABERTA',
      defeito: p.defeito || '',
      observacoes: p.observacoes || '',
      servicos: servicos as any,
      valorTotal,
      ownerEmail: owner || undefined,
    } as OrdemServico;
    list.push(ordem);
    await save(list);
    await load();
    return ordem;
  }, [load, save]);

  const atualizar = useCallback(async (o: OrdemServico) => {
    const json = await AsyncStorage.getItem(ORDENS_KEY);
    const list: OrdemServico[] = json ? JSON.parse(json) : [];
    const idx = list.findIndex(x => x.id === o.id);
    if (idx >= 0) list[idx] = o;
    await save(list);
    await load();
  }, [load, save]);

  const remover = useCallback(async (id: string) => {
    const json = await AsyncStorage.getItem(ORDENS_KEY);
    const list: OrdemServico[] = json ? JSON.parse(json) : [];
    const filtered = list.filter(x => x.id !== id);
    await save(filtered);
    await load();
  }, [load, save]);

  useEffect(() => { load(); }, [load]);

  return { ordens, loading, load, criar, atualizar, remover };
}

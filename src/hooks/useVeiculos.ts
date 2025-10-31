import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Veiculo } from '../types';

const VEICULOS_KEY = '@osfacil:veiculos';

function genId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(VEICULOS_KEY);
      const data: Veiculo[] = json ? JSON.parse(json) : [];
      setVeiculos(data.reverse());
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (data: Veiculo[]) => {
    await AsyncStorage.setItem(VEICULOS_KEY, JSON.stringify(data));
  }, []);

  const criar = useCallback(async (p: Omit<Veiculo, 'id' | 'dataCadastro'>) => {
    const json = await AsyncStorage.getItem(VEICULOS_KEY);
    const list: Veiculo[] = json ? JSON.parse(json) : [];
    const v: Veiculo = { id: genId(), ...p, dataCadastro: new Date().toISOString() } as Veiculo;
    list.push(v);
    await save(list);
    await load();
    return v;
  }, [load, save]);

  const atualizar = useCallback(async (v: Veiculo) => {
    const json = await AsyncStorage.getItem(VEICULOS_KEY);
    const list: Veiculo[] = json ? JSON.parse(json) : [];
    const idx = list.findIndex(x => x.id === v.id);
    if (idx >= 0) list[idx] = v;
    await save(list);
    await load();
  }, [load, save]);

  const remover = useCallback(async (id: string) => {
    const json = await AsyncStorage.getItem(VEICULOS_KEY);
    const list: Veiculo[] = json ? JSON.parse(json) : [];
    const filtered = list.filter(x => x.id !== id);
    await save(filtered);
    await load();
  }, [load, save]);

  useEffect(() => { load(); }, [load]);

  return { veiculos, loading, load, criar, atualizar, remover };
}

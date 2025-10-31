import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cliente } from '../types';

const CLIENTES_KEY = '@osfacil:clientes';

function genId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(CLIENTES_KEY);
      const data: Cliente[] = json ? JSON.parse(json) : [];
      setClientes(data.reverse());
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (data: Cliente[]) => {
    await AsyncStorage.setItem(CLIENTES_KEY, JSON.stringify(data));
  }, []);

  const criar = useCallback(async (p: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    const json = await AsyncStorage.getItem(CLIENTES_KEY);
    const list: Cliente[] = json ? JSON.parse(json) : [];
    const cliente: Cliente = { id: genId(), ...p, dataCadastro: new Date().toISOString() } as Cliente;
    list.push(cliente);
    await save(list);
    await load();
    return cliente;
  }, [load, save]);

  const atualizar = useCallback(async (c: Cliente) => {
    const json = await AsyncStorage.getItem(CLIENTES_KEY);
    const list: Cliente[] = json ? JSON.parse(json) : [];
    const idx = list.findIndex(x => x.id === c.id);
    if (idx >= 0) list[idx] = c;
    await save(list);
    await load();
  }, [load, save]);

  const remover = useCallback(async (id: string) => {
    const json = await AsyncStorage.getItem(CLIENTES_KEY);
    const list: Cliente[] = json ? JSON.parse(json) : [];
    const filtered = list.filter(x => x.id !== id);
    await save(filtered);
    await load();
  }, [load, save]);

  useEffect(() => { load(); }, [load]);

  return { clientes, loading, load, criar, atualizar, remover };
}

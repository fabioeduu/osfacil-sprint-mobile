import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@osfacil:token';

export type Token = { email: string; role?: string } | null;

export async function getToken(): Promise<Token> {
  try {
    const j = await AsyncStorage.getItem(TOKEN_KEY);
    if (!j) return null;
    return JSON.parse(j) as Token;
  } catch (e) {
    return null;
  }
}

export async function getRole(): Promise<string | null> {
  const t = await getToken();
  return t?.role ?? null;
}

export async function getEmail(): Promise<string | null> {
  const t = await getToken();
  return t?.email ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const role = await getRole();
  return role === 'admin';
}


export function useAuth() {
  const [token, setToken] = useState<Token>(null);

  const load = useCallback(async () => {
    const t = await getToken();
    setToken(t);
  }, []);

  useEffect(() => { load(); }, [load]);

  const reload = async () => { await load(); };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return {
    token,
    role: token?.role ?? null,
    email: token?.email ?? null,
    reload,
    logout,
    isAdmin: () => token?.role === 'admin',
  } as const;
}

export default useAuth;

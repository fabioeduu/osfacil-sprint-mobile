import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@osfacil:token';
const PROFILE_KEY = '@osfacil:profile';

type Profile = {
  nome?: string;
  email?: string;
  role?: string;
  telefone?: string;
  endereco?: string;
};

type AuthContextValue = {
  token: string | null;
  profile: Profile | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, profile: Profile) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const [storedToken, storedProfile] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);

      setToken(storedToken);
      setProfile(storedProfile ? (JSON.parse(storedProfile) as Profile) : null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signIn = async (nextToken: string, nextProfile: Profile) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, nextToken),
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile)),
    ]);
    setToken(nextToken);
    setProfile(nextProfile);
  };

  const signOut = async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(PROFILE_KEY),
    ]);
    setToken(null);
    setProfile(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      profile,
      email: profile?.email ?? null,
      role: profile?.role ?? null,
      isAuthenticated: Boolean(token),
      isLoading,
      signIn,
      signOut,
      refreshSession,
      isAdmin: (profile?.role ?? '').toLowerCase().replace(/^role_/, '') === 'admin',
    }),
    [token, profile, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return ctx;
}

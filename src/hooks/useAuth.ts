import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const auth = useAuthContext();

  return {
    token: auth.token,
    profile: auth.profile,
    role: auth.role,
    email: auth.email,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    reload: auth.refreshSession,
    logout: auth.signOut,
    signIn: auth.signIn,
    isAdmin: () => auth.isAdmin,
  } as const;
}

export default useAuth;

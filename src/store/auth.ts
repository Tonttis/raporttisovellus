import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, setAuthToken } from '@/lib/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token: string, user: User) => {
        setAuthToken(token);
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        setAuthToken(null);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);

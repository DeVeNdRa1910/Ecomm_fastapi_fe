import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo } from '@/lib/auth-api';

interface AuthState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: UserInfo) => {
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },
      isAuthenticated: () => {
        return get().user !== null;
      },
    }),
    {
      name: 'ecomm-auth-storage',
    }
  )
);


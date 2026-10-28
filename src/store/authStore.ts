import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/api';
import { setAuthToken, removeAuthToken, authApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  restoreSession: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,

      login: (user, token) => {
        setAuthToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          isLoading: false,
        });
      },

      logout: () => {
        removeAuthToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      updateUser: (updates) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...updates };
        set({
          user: updated,
          isAdmin: updated.role === 'admin',
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      // Restores session by verifying token with the server
      restoreSession: async () => {
        const { token } = get();
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await authApi.getMe();
          const { user } = res.data.data!;
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isLoading: false,
          });
        } catch {
          // Token is invalid / expired — clear everything
          removeAuthToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'saturn3d_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-sync token to localStorage on rehydration
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);

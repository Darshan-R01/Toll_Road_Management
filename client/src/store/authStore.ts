import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userVehicle: string | null;
  login: (role: 'user' | 'admin', vehicleId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      userVehicle: null,
      login: (role, vehicleId) => set({
        isAuthenticated: true,
        isAdmin: role === 'admin',
        userVehicle: vehicleId || null,
      }),
      logout: () => {
        set({ isAuthenticated: false, isAdmin: false, userVehicle: null });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
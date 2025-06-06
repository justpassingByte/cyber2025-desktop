import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
  email?: string;
  balance: number;
  timeRemaining: number; // in seconds
  rank: string;
  dailyStreak: number;
  // ... các trường khác nếu cần
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void; 
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          timeRemaining: user.timeRemaining ?? 3 * 60 * 60, // Default 3 hours
          rank: user.rank ?? 'Pro Gamer',
          dailyStreak: user.dailyStreak ?? 7,
        }
      }),
      updateUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : null 
      })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store', // key in storage
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
); 
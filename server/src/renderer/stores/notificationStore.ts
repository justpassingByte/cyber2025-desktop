import { create, StateCreator } from 'zustand';

interface NotificationState {
  unreadCount: number;
  incrementNotificationCount: () => void;
  decrementNotificationCount: () => void;
  resetNotificationCount: () => void;
}

const notificationStore: StateCreator<NotificationState> = (set) => ({
  unreadCount: 0,
  incrementNotificationCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementNotificationCount: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  resetNotificationCount: () => set({ unreadCount: 0 }),
});

export const useNotificationStore = create<NotificationState>()(notificationStore); 
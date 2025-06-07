import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;

// Biến để giữ ID của interval, nằm ngoài store để tránh re-render không cần thiết
let optimisticTimer: NodeJS.Timeout | null = null;

export interface User {
  id: number;
  username: string;
  email?: string;
  balance: number;
  time_remaining: number; // Đổi tên cho nhất quán với server
  rank: string;
  dailyStreak: number;
  // ... các trường khác nếu cần
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void; 
  clearUser: () => void;
  startOptimisticCounter: () => void; // Action mới
  stopOptimisticCounter: () => void; // Action mới
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      
      // Bắt đầu hoặc khởi động lại bộ đếm lạc quan
      startOptimisticCounter: () => {
        get().stopOptimisticCounter(); // Dừng bộ đếm cũ trước khi bắt đầu cái mới

        const tick = () => {
          const currentUser = get().user;
          if (currentUser && currentUser.time_remaining > 0) {
            set({
              user: { ...currentUser, time_remaining: currentUser.time_remaining - 1 },
            });
          } else {
            get().stopOptimisticCounter(); // Dừng nếu hết giờ
          }
        };

        optimisticTimer = setInterval(tick, 1000);
      },

      // Dừng bộ đếm
      stopOptimisticCounter: () => {
        if (optimisticTimer) {
          clearInterval(optimisticTimer);
          optimisticTimer = null;
        }
      },

      setUser: (user) => {
        set({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
            time_remaining: user.time_remaining ?? 0,
            rank: user.rank ?? 'Pro Gamer',
            dailyStreak: user.dailyStreak ?? 7,
          },
        });
        get().startOptimisticCounter(); // Bắt đầu đếm sau khi set user
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
        // Nếu server cập nhật thời gian, chúng ta đồng bộ và khởi động lại bộ đếm
        if (userData.time_remaining !== undefined) {
             get().startOptimisticCounter();
        }
      },

      clearUser: () => {
        get().stopOptimisticCounter(); // Dừng đếm khi logout
        set({ user: null });
      },
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

// --- Tích hợp IPC Listeners & Session Validation ---

// Hàm để khởi tạo các listeners và xác thực session
async function initializeSession() {
  if (!ipcRenderer) {
    console.warn('IPC renderer not available. Real-time features are disabled.');
    return;
  }

  // Bước 1: Xác thực session đã lưu trong sessionStorage (nếu có)
  const state = useUserStore.getState();
  if (state.user) {
    console.log(`[UserStore] Found stored user ${state.user.id}. Validating session...`);
    const response = await ipcRenderer.invoke('auth:validate-stored-session', { userId: state.user.id });
    
    if (response.isValid && response.customer) {
      // Nếu session hợp lệ, cập nhật lại dữ liệu mới nhất từ server và bắt đầu đếm
      console.log('[UserStore] Session is valid. Updating user data and starting counter.');
      state.updateUser(response.customer);
    } else {
      // Nếu không hợp lệ, xóa dữ liệu
      console.log('[UserStore] Session is invalid or timed out. Clearing user data.');
      state.clearUser();
    }
  }

  // Bước 2: Thiết lập các listeners cho các sự kiện real-time
  console.log('[UserStore] Setting up IPC listeners...');

  const handleSessionUpdate = (_event: any, data: { time_remaining: number; balance: number }) => {
    console.log('[UserStore] Received session:data-updated. Syncing time.', data);
    // Chỉ gọi updateUser, nó sẽ tự động khởi động lại bộ đếm
    useUserStore.getState().updateUser({
      time_remaining: data.time_remaining,
      balance: data.balance,
    });
  };

  const handleForceLogout = () => {
    console.log('[UserStore] Received auth:force-logout. Clearing user data...');
    useUserStore.getState().clearUser();
  };
  
  ipcRenderer.on('session:data-updated', handleSessionUpdate);
  ipcRenderer.on('auth:force-logout', handleForceLogout);
  
  // Không cần trả về hàm cleanup ở đây nữa vì nó là một phần của luồng khởi tạo
}

// Gọi hàm để thiết lập listeners và xác thực ngay khi app được tải
initializeSession(); 
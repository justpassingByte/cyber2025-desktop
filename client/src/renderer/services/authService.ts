export interface UserData {
  id: number;
  username: string;
  email: string;
  balance: number;
  time_remaining?: number;
  points: number;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  customer?: UserData;
  error?: string;
}

const ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined;

class AuthService {
  /**
   * Đăng nhập qua IPC
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (!ipcRenderer) throw new Error('ipcRenderer not available');
    console.log('CLIENT: Calling auth:login with credentials', credentials);
    const response = await ipcRenderer.invoke('auth:login', credentials);
    console.log('CLIENT: Received auth:login response', response);
    return response;
  }

  /**
   * Đăng xuất qua IPC
   */
  async logout(userId: number): Promise<{ success: boolean; error?: string }> {
    if (!ipcRenderer) throw new Error('ipcRenderer not available');
    return ipcRenderer.invoke('auth:logout', { userId });
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  async isSocketConnected(): Promise<boolean> {
    if (!ipcRenderer) throw new Error('ipcRenderer not available');
    return ipcRenderer.invoke('socket:check-connection');
  }
}

export default new AuthService(); 
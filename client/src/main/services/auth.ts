/**
 * Interface cho Customer dùng tại client
 */
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  points?: number;
  balance: number;
  created_at?: Date;
  status?: string;
  last_seen?: Date;
  address?: string;
  dob?: string;
  avatar_url?: string;
}

/**
 * Interface cho dữ liệu đăng nhập
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interface cho kết quả đăng nhập
 */
export interface LoginResult {
  success: boolean;
  customer?: Partial<Customer>;
  error?: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Xử lý đăng nhập qua socket (logic phía client, không liên quan socket instance)
   * @param credentials Thông tin đăng nhập
   * @returns Kết quả đăng nhập với thông tin khách hàng nếu thành công
   */
  async handleLogin(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: 'Vui lòng nhập tên đăng nhập và mật khẩu'
        };
      }
      // Logic xử lý đăng nhập phía client nếu cần
      return {
        success: true,
        customer: {
          id: 0,
          name: '',
          email: '',
          balance: 0
        }
      };
    } catch (error) {
      console.error('Client auth service error:', error);
      return {
        success: false,
        error: 'Lỗi xử lý đăng nhập'
      };
    }
  }

  /**
   * Xử lý đăng xuất (logic phía client, không liên quan socket instance)
   */
  async handleLogout(userId: number): Promise<void> {
    try {
      console.log(`Client auth service: handling logout for user ${userId}`);
      // Logic xử lý đăng xuất phía client nếu cần
    } catch (error) {
      console.error('Client auth logout error:', error);
    }
  }
}

export default AuthService.getInstance(); 
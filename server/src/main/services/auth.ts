import database from './database';
import { Customer } from '../models';
import systemLogService from './systemLog';
import customerLogService from './customerLog';
import { Socket } from 'socket.io';
import socketService from './socket';
import sessionService from './sessionService';

interface LoginResult {
  success: boolean;
  customer?: any;
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
   * Xử lý đăng nhập qua socket
   * @param socket Socket đang kết nối
   * @param credentials Thông tin đăng nhập
   * @returns Kết quả đăng nhập với thông tin khách hàng nếu thành công
   */
  async handleSocketLogin(socket: Socket, credentials: { username: string; password: string }): Promise<LoginResult> {
    console.log('[handleSocketLogin] Called with credentials:', credentials);
    const { username, password } = credentials;
    const ip_address = socket.handshake.address || 'unknown';
    
    console.log(`Socket login attempt for: ${username} from ${ip_address}`);
    
    try {
      // Xác thực thông tin đăng nhập - tìm theo username/email/phone
      const customer = await this.authenticate(username, password, ip_address);
      
      if (customer) {
        // Sử dụng hàm validateAndActivateCustomer
        const validation = await this.validateAndActivateCustomer(customer);
        if (!validation.success) {
          return {
            success: false,
            error: validation.error
          };
        }

        // Bắt đầu session
        await sessionService.startSession(customer, socket);
        
        // Trả về customer đã được cập nhật
        return {
          success: true,
          customer
        };
      }
      return {
        success: false,
        error: 'Sai thông tin đăng nhập!'
      };
    } catch (err) {
      console.error('[handleSocketLogin] Lỗi:', err);
      return {
        success: false,
        error: 'Lỗi hệ thống khi đăng nhập!'
      };
    }
  }
  
  /**
   * Xử lý đăng xuất qua socket
   * @param socket Socket đang kết nối
   * @param data Thông tin người dùng đăng xuất
   */
  async handleSocketLogout(socket: Socket, data: { userId: number }): Promise<void> {
    const { userId } = data;
    const ip_address = socket.handshake.address || 'unknown';

    try {
      await sessionService.endSession(userId, socket, 'user_logout');
    } catch (error) {
      console.error('Socket logout error:', error);
      
      // Ghi log lỗi
      await systemLogService.error(
        'security',
        'Socket logout error',
        error,
        ip_address
      );
    }
  }

  /**
   * Authenticate customer
   * @param identifier Email, phone hoặc username
   * @param password Password (should be hashed in production)
   * @param ip_address IP address của người dùng (optional)
   * @returns Customer object if authentication is successful, null otherwise
   */
  public async authenticate(identifier: string, password: string, ip_address?: string): Promise<Customer | null> {
    try {
      console.log(`AUTH DEBUG: authenticate called for identifier: ${identifier}`);
      
      const customerRepo = database.getRepository(Customer);
      
      // Tìm kiếm theo email, phone hoặc name (username)
      const customer = await customerRepo.findOne({ 
        where: [
          { email: identifier, password_hash: password },
          { phone: identifier, password_hash: password },
          { name: identifier, password_hash: password }
        ]
      });

      console.log(`AUTH DEBUG: authentication result: ${customer ? 'FOUND' : 'NOT FOUND'}`);
      if (customer) {
        console.log(`AUTH DEBUG: Customer details - ID: ${customer.id}, Name: ${customer.name}, Time Remaining: ${customer.time_remaining}, Balance: ${customer.balance}`);
      }
      
      // Ghi log đăng nhập
      if (customer) {
        await customerLogService.log(
          customer.id,
          'login',
          { 
            identifier, 
            time: new Date().toISOString(),
            success: true 
          },
          ip_address
        );
      } else {
        await systemLogService.log(
          'security',
          'Đăng nhập thất bại',
          { 
            identifier, 
            time: new Date().toISOString(),
            success: false 
          },
          'warning',
          ip_address
        );
      }
      
      return customer || null;
    } catch (error) {
      console.error('Authentication error:', error);
      await systemLogService.error(
        'security',
        'Lỗi đăng nhập',
        error,
        ip_address
      );
      return null;
    }
  }

  /**
   * Register a new customer
   * @param customerData Customer data
   * @param ip_address IP address của người dùng (optional)
   * @returns Created customer if successful, null otherwise
   */
  public async register(customerData: Partial<Customer>, ip_address?: string): Promise<Customer | null> {
    try {
      const customerRepo = database.getRepository(Customer);
      
      // Check if email already exists
      if (customerData.email) {
        const existingCustomer = await customerRepo.findOne({
          where: { email: customerData.email }
        });
        
        if (existingCustomer) {
          await systemLogService.log(
            'security',
            'Đăng ký thất bại - Email đã tồn tại',
            { 
              email: customerData.email, 
              time: new Date().toISOString(),
              reason: 'email_exists' 
            },
            'warning',
            ip_address
          );
          return null;
        }
      }
      
      // Create new customer
      const customer = customerRepo.create(customerData);
      const savedCustomer = await customerRepo.save(customer);
      
      // Ghi log đăng ký thành công
      await customerLogService.log(
        savedCustomer.id,
        'register',
        { 
          email: customerData.email,
          time: new Date().toISOString() 
        },
        ip_address
      );
      
      return savedCustomer;
    } catch (error) {
      console.error('Registration error:', error);
      await systemLogService.error(
        'security',
        'Lỗi đăng ký',
        error,
        ip_address
      );
      return null;
    }
  }

  /**
   * Create default customers if no customers exist
   */
  public async createDefaultCustomers(): Promise<void> {
    try {
      const customerRepo = database.getRepository(Customer);
      const customerCount = await customerRepo.count();
      
      if (customerCount === 0) {
        console.log('Creating default customers...');
        
        // Create admin customer
        const adminCustomer = customerRepo.create({
          name: 'Admin User',
          email: 'admin@cybercafe.com',
          password_hash: 'password', // Should be hashed in production
          points: 0,
          balance: 0
        });
        const savedAdmin = await customerRepo.save(adminCustomer);
        
        // Create test client customer
        const clientCustomer = customerRepo.create({
          name: 'Test Client',
          email: 'client@cybercafe.com',
          password_hash: 'password', // Should be hashed in production
          phone: '0123456789',
          points: 100,
          balance: 1000
        });
        const savedClient = await customerRepo.save(clientCustomer);
        
        // Ghi log tạo người dùng mặc định
        await systemLogService.log(
          'app',
          'Tạo người dùng mặc định',
          { count: 2, time: new Date().toISOString() }
        );
        
        console.log('Default customers created');
      }
    } catch (error) {
      console.error('Error creating default customers:', error);
      await systemLogService.error(
        'app',
        'Lỗi tạo người dùng mặc định',
        error
      );
    }
  }

  /**
   * Kiểm tra điều kiện đăng nhập và cập nhật trạng thái active nếu hợp lệ
   */
  public async validateAndActivateCustomer(customer: Customer): Promise<{ success: boolean; error?: string }> {
    const rate = 10000; // TODO: Replace with config value
    const hasTimeRemaining = customer.time_remaining && customer.time_remaining > 0;
    const hasEnoughBalance = customer.balance && customer.balance >= rate;
    const customerRepo = database.getRepository(Customer);
    if (!hasTimeRemaining && !hasEnoughBalance) {
      return {
        success: false,
        error: 'Bạn đã hết giờ chơi và số dư không đủ để tự động chuyển đổi. Vui lòng nạp thêm tiền!'
      };
    }
    // Nếu đủ điều kiện, xử lý chuyển đổi tiền sang giờ nếu cần
    if (!hasTimeRemaining && hasEnoughBalance) {
      // Chỉ chuyển đổi một lượng tiền vừa đủ cho 1 giờ chơi thay vì toàn bộ số dư
      const moneyToDeduct = rate;
      const timeToAddInSeconds = 3600; // 1 giờ

      const originalBalance = customer.balance;
      const originalTimeRemaining = customer.time_remaining || 0;

      // Cập nhật thông tin local customer object để phản ánh thay đổi
      customer.balance -= moneyToDeduct;
      customer.time_remaining = originalTimeRemaining + timeToAddInSeconds;
      
      // Lưu thay đổi vào database
      await customerRepo.update(customer.id, {
        balance: customer.balance,
        time_remaining: customer.time_remaining
      });

      // Chuẩn bị chi tiết để ghi log
      const logDetails = {
        amount_converted: moneyToDeduct,
        time_added_seconds: timeToAddInSeconds,
        balance_before: originalBalance,
        balance_after: customer.balance,
        time_remaining_before: originalTimeRemaining,
        time_remaining_after: customer.time_remaining
      };

      // Ghi log hệ thống về sự kiện này
      await systemLogService.log(
        'billing',
        `Auto-converted ${moneyToDeduct} from balance to ${timeToAddInSeconds / 3600}h of time for customer ${customer.name} (ID: ${customer.id})`,
        { customer_id: customer.id, ...logDetails },
        'info'
      );

      // Ghi log cho khách hàng về sự kiện này
      await customerLogService.log(
        customer.id,
        'auto_convert_balance_to_time',
        logDetails
      );
    }
    return { success: true };
  }
}

export default AuthService.getInstance(); 
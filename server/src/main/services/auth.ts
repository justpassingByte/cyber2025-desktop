import database from './database';
import { Customer } from '../models';
import systemLogService from './systemLog';
import customerLogService from './customerLog';
import { Socket } from 'socket.io';

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
    const { username, password } = credentials;
    const ip_address = socket.handshake.address || 'unknown';
    
    console.log(`Socket login attempt for: ${username} from ${ip_address}`);
    
    try {
      // Xác thực thông tin đăng nhập - tìm theo username/email/phone
      const customer = await this.authenticate(username, password, ip_address);
      
      if (customer) {
        console.log(`Customer ${customer.name} authenticated successfully via socket`);
        
        // Đăng ký socket với customer ID để dễ dàng emit tới họ sau này
        socket.join(`customer:${customer.id}`);
        
        // Loại bỏ password_hash trước khi gửi về client
        const { password_hash, ...customerData } = customer;
        
        // Ghi log đăng nhập thành công
        await customerLogService.log(
          customer.id,
          'login',
          {
            username: customer.name,
            email: customer.email,
            ip_address: ip_address,
            time: new Date().toISOString(),
            method: 'socket'
          },
          ip_address
        );
        
        // Trả về kết quả đăng nhập thành công
        return {
          success: true,
          customer: customerData
        };
      } else {
        console.log(`Socket authentication failed for: ${username}`);
        
        // Ghi log thất bại
        await systemLogService.log(
          'security',
          'Failed authentication attempt via socket',
          {
            username,
            ip_address: ip_address,
            time: new Date().toISOString()
          },
          'warning',
          ip_address
        );
        
        // Trả về thông báo lỗi
        return {
          success: false,
          error: 'Tên đăng nhập hoặc mật khẩu không đúng'
        };
      }
    } catch (error) {
      console.error('Socket login error:', error);
      
      // Ghi log lỗi
      await systemLogService.error(
        'security',
        'Socket login error',
        error,
        ip_address
      );
      
      // Trả về thông báo lỗi
      return {
        success: false,
        error: 'Lỗi xác thực'
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
    
    console.log(`Socket logout for user ID: ${userId}`);
    
    try {
      // Thoát khỏi room của customer
      socket.leave(`customer:${userId}`);
      
      // Ghi log đăng xuất
      await customerLogService.log(
        userId,
        'logout',
        {
          ip_address: ip_address,
          time: new Date().toISOString(),
          method: 'socket'
        },
        ip_address
      );
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
      const customerRepo = database.getRepository(Customer);
      
      // Tìm kiếm theo email, phone hoặc name (username)
      const customer = await customerRepo.findOne({ 
        where: [
          { email: identifier, password_hash: password },
          { phone: identifier, password_hash: password },
          { name: identifier, password_hash: password }
        ]
      });

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
}

export default AuthService.getInstance(); 
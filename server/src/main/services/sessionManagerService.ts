import { Customer, Session } from '../models';
import database from './database';
import sessionService from './sessionService';
import socketService from './socket';
import systemLogService from './systemLog';
import customerLogService from './customerLog';

// Định nghĩa cấu trúc dữ liệu cho một phiên đang hoạt động
interface ActiveSession {
  customer: Customer;
  intervalId?: NodeJS.Timeout;
}

const TICK_INTERVAL = 1000; // 1 giây
const TIME_UPDATE_INTERVAL = 10000; // Gửi cập nhật cho client mỗi 10 giây

class SessionManagerService {
  private static instance: SessionManagerService;
  private activeSessions: Map<number, ActiveSession> = new Map();
  private globalTicker: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): SessionManagerService {
    if (!SessionManagerService.instance) {
      SessionManagerService.instance = new SessionManagerService();
    }
    return SessionManagerService.instance;
  }

  public start() {
    if (this.globalTicker) {
      console.log('SessionManagerService is already running.');
      return;
    }
    console.log('Starting SessionManagerService...');
    this.globalTicker = setInterval(() => this.tick(), TICK_INTERVAL);
  }

  public stop() {
    if (this.globalTicker) {
      clearInterval(this.globalTicker);
      this.globalTicker = null;
      console.log('SessionManagerService stopped.');
    }
  }

  public registerSession(customer: Customer) {
    if (this.activeSessions.has(customer.id)) {
      console.log(`Session for customer ${customer.id} is already registered.`);
      return;
    }
    console.log(`Registering session for customer ${customer.id}`);
    this.activeSessions.set(customer.id, { customer });
  }

  public unregisterSession(customerId: number) {
    if (this.activeSessions.has(customerId)) {
      this.activeSessions.delete(customerId);
      console.log(`Unregistered session for customer ${customerId}`);
    }
  }

  /**
   * Cập nhật số dư cho một phiên đang hoạt động trong bộ nhớ.
   * @param customerId ID của khách hàng
   * @param newBalance Số dư mới
   */
  public updateSessionBalance(customerId: number, newBalance: number) {
    const session = this.activeSessions.get(customerId);
    if (session) {
      session.customer.balance = newBalance;
      console.log(`Updated in-memory balance for customer ${customerId} to ${newBalance}`);
      
      // Gửi ngay một bản cập nhật đến client để đảm bảo đồng bộ
      this.updateClient(customerId, {
        time_remaining: session.customer.time_remaining || 0,
        balance: newBalance,
      });
    }
  }

  /**
   * Quét DB khi khởi động để phục hồi các session chưa được đóng đúng cách (do server crash)
   */
  public async resumeActiveSessions() {
    console.log('Attempting to resume active sessions from database...');
    const sessionRepo = database.getRepository(Session);
    const customerRepo = database.getRepository(Customer);

    // Tìm tất cả các phiên chưa được đóng đúng cách
    const orphanedSessions = await sessionRepo.find({
      where: { status: 'active' },
      relations: ['customer'], // Tải luôn dữ liệu customer để tránh truy vấn lại
    });

    if (orphanedSessions.length === 0) {
      console.log('No active sessions to resume.');
      return;
    }

    console.log(`Found ${orphanedSessions.length} session(s) to resume.`);

    for (const session of orphanedSessions) {
      const customer = session.customer;
      if (!customer) {
        console.warn(`Session ${session.id} has no associated customer, skipping.`);
        await sessionRepo.update(session.id, { status: 'cancelled', end_time: new Date() }); // Đóng session mồ côi
        continue;
      }

      const now = new Date();
      const startTime = session.start_time;
      // Thời gian đã trôi tính bằng giây kể từ khi session bắt đầu
      const elapsedSeconds = Math.round((now.getTime() - startTime.getTime()) / 1000);

      let timeRemaining = customer.time_remaining || 0;
      
      console.log(`Resuming session for ${customer.name}. Time at crash: ${timeRemaining}s. Elapsed since start: ${elapsedSeconds}s.`);

      timeRemaining -= elapsedSeconds;

      if (timeRemaining <= 0) {
        // Nếu thời gian đã hết trong lúc server offline
        customer.time_remaining = 0;
        await customerRepo.save(customer); // Lưu lại thời gian về 0
        console.log(`Time for ${customer.name} expired while server was down. Forcing logout.`);
        // Gọi endSession để xử lý đăng xuất và đóng session trong DB
        await sessionService.endSession(customer.id, undefined, 'auto_expired');
      } else {
        // Nếu vẫn còn thời gian
        customer.time_remaining = timeRemaining;
        await customerRepo.save(customer); // Lưu lại thời gian còn lại mới
        
        // Đăng ký lại khách hàng vào bộ đếm trong RAM
        console.log(`Re-registering ${customer.name} with ${timeRemaining}s remaining.`);
        this.registerSession(customer);
      }
    }
  }

  private async tick() {
    if (this.activeSessions.size === 0) return;
    
    for (const [customerId, session] of this.activeSessions.entries()) {
      const { customer } = session;
      
      // Chỉ xử lý nếu khách hàng còn thời gian
      if (customer.time_remaining && customer.time_remaining > 0) {
        customer.time_remaining -= 1;

        // Gửi cập nhật định kỳ cho client
        if (customer.time_remaining % (TIME_UPDATE_INTERVAL / 1000) === 0) {
           this.updateClient(customerId, { 
             time_remaining: customer.time_remaining,
             balance: customer.balance
           });
        }
        
      } else {
        // Hết thời gian, xử lý logic
        await this.handleTimeExpired(customer);
      }
    }
  }

  private async handleTimeExpired(customer: Customer) {
    console.log(`Time expired for customer ${customer.name} (ID: ${customer.id}). Checking balance...`);
    
    const customerRepo = database.getRepository(Customer);
    const latestCustomerData = await customerRepo.findOne({ where: { id: customer.id } });

    if (!latestCustomerData) {
        console.error(`Could not find customer ${customer.id} in DB for time expiration handling.`);
        this.unregisterSession(customer.id);
        return;
    }

    const rate = 10000; // Lấy từ config sau
    
    // Kiểm tra số dư để chuyển đổi
    if (latestCustomerData.balance >= rate) {
        const timeToAdd = 3600; // 1 giờ
        const newBalance = latestCustomerData.balance - rate;
        const newTimeRemaining = (latestCustomerData.time_remaining || 0) + timeToAdd;

        await customerRepo.update(customer.id, {
            balance: newBalance,
            time_remaining: newTimeRemaining,
        });

        // Cập nhật lại session object trong bộ nhớ
        customer.balance = newBalance;
        customer.time_remaining = newTimeRemaining;
        
        const logDetails = {
            amount_converted: rate,
            time_added_seconds: timeToAdd,
            balance_before: latestCustomerData.balance,
            balance_after: newBalance,
        };

        systemLogService.log('billing', `Auto-converted balance for ${customer.name}`, logDetails);
        customerLogService.log(customer.id, 'auto_convert_balance_to_time', logDetails);

        this.updateClient(customer.id, { time_remaining: newTimeRemaining, balance: newBalance });

    } else {
      console.log(`Customer ${customer.name} has insufficient balance. Logging out.`);
      // Ngừng theo dõi ngay lập tức để tránh lặp lại
      this.unregisterSession(customer.id);
      // Gọi service để xử lý đăng xuất với lý do 'auto_expired'
      await sessionService.endSession(customer.id, undefined, 'auto_expired');
    }
  }
  
  private updateClient(customerId: number, data: { time_remaining: number; balance: number }) {
    console.log(`Updating client for customer ${customerId} with data:`, data);
    socketService.emitToCustomer(customerId, 'session:update', data);
  }

  public getActiveSession(customerId: number): ActiveSession | undefined {
    return this.activeSessions.get(customerId);
  }
}

export default SessionManagerService.getInstance(); 
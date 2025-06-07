import database from './database';
import { Customer, Session } from '../models';
import socketService from './socket';
import systemLogService from './systemLog';
import customerLogService from './customerLog';
import { Socket } from 'socket.io';
import sessionManagerService from './sessionManagerService';

// Thêm kiểu cho lý do đăng xuất
type LogoutReason = 'user_logout' | 'auto_expired' | 'admin_kick' | 'unknown';

class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * Bắt đầu một phiên làm việc cho khách hàng (đăng nhập)
   * @param customer Khách hàng
   * @param socket Socket của khách hàng
   */
  public async startSession(customer: Customer, socket: Socket): Promise<void> {
    const customerRepo = database.getRepository(Customer);
    const sessionRepo = database.getRepository(Session);
    const ip_address = socket.handshake.address || 'unknown';

    try {
      // 1. Cập nhật trạng thái 'active' trong DB nếu cần
      if (customer.status !== 'active') {
        await customerRepo.update(customer.id, { status: 'active' });
        customer.status = 'active'; // Cập nhật local object
      }

      // 2. Liên kết customer với socket và tham gia room
      socket.join(`customer:${customer.id}`);
      socketService.linkCustomerToSocket(customer.id, socket.id);
      
      // 3. Đăng ký session với bộ quản lý để bắt đầu đếm giờ
      sessionManagerService.registerSession(customer);

      // 4. Gửi sự kiện cập nhật trạng thái cho admin UI
      socketService.emitToAdmins('customer:status-changed', {
        customer_id: customer.id,
        status: 'active'
      });

       // 5. Gửi thông báo đăng nhập cho admin UI
       socketService.emitToAdmins('admin:login-notification', {
        customerId: customer.id,
        customerName: customer.name,
        time: new Date().toISOString()
      });

      // 6. Tạo một bản ghi session mới trong DB
      const newSession = sessionRepo.create({
          customer_id: customer.id,
          start_time: new Date(),
          status: 'active',
          // computer_id sẽ cần được thêm vào nếu có thông tin máy client
      });
      await sessionRepo.save(newSession);

      // 7. Ghi log hệ thống
      await systemLogService.log(
        'session',
        `Session started for ${customer.name}`,
        { customer_id: customer.id, ip_address },
        'info'
      );
    } catch (error) {
      console.error(`Error starting session for customer ${customer.id}:`, error);
      await systemLogService.error(
        'session',
        'Error starting session',
        { customer_id: customer.id, error },
        ip_address
      );
    }
  }

  /**
   * Kết thúc phiên làm việc của khách hàng (đăng xuất)
   * @param userId ID của khách hàng
   * @param socket (Optional) Socket của khách hàng
   * @param reason Lý do đăng xuất
   */
  public async endSession(userId: number, socket?: Socket, reason: LogoutReason = 'unknown'): Promise<void> {
    const customerRepo = database.getRepository(Customer);
    const sessionRepo = database.getRepository(Session);
    const ip_address = socket?.handshake.address || 'unknown';

    try {
      // BƯỚC QUAN TRỌNG: Lấy session hiện tại từ bộ nhớ để có time_remaining chính xác
      const activeManagedSession = sessionManagerService.getActiveSession(userId);
      let finalTimeRemaining: number | undefined;

      if (activeManagedSession) {
        finalTimeRemaining = activeManagedSession.customer.time_remaining;
        console.log(`[SessionEnd] Got final time for user ${userId} from memory: ${finalTimeRemaining}s`);
      } else {
        console.warn(`[SessionEnd] Could not find user ${userId} in memory manager. Time might not be saved correctly.`);
      }
      
      // 1. Hủy đăng ký session khỏi bộ quản lý
      sessionManagerService.unregisterSession(userId);

      // 2. Cập nhật trạng thái và thời gian còn lại cuối cùng vào bảng Customer
      await customerRepo.update(userId, { 
        status: 'inactive',
        // Chỉ cập nhật time_remaining nếu chúng ta lấy được nó từ bộ nhớ
        ...(finalTimeRemaining !== undefined && { time_remaining: finalTimeRemaining })
      });

      // 3. Tìm và cập nhật bản ghi session trong DB
      const activeSession = await sessionRepo.findOne({
        where: { customer_id: userId, status: 'active' },
        order: { start_time: 'DESC' } // Lấy session mới nhất
      });

      if (activeSession) {
        activeSession.end_time = new Date();
        activeSession.status = reason === 'auto_expired' ? 'completed' : 'cancelled';
        await sessionRepo.save(activeSession);
      } else {
        systemLogService.log('session', `Could not find active session to close for customer ${userId}`, { customer_id: userId }, 'warning');
      }

      // 4. Gửi sự kiện cập nhật trạng thái cho admin UI
      socketService.emitToAdmins('customer:status-changed', {
        customer_id: userId,
        status: 'inactive'
      });
      
      // Gửi thông báo logout riêng để hiển thị notification
      const customer = await customerRepo.findOne({ where: { id: userId } });
      if (customer) {
        socketService.emitToAdmins('admin:logout-notification', {
          customerId: userId,
          customerName: customer.name,
          time: new Date().toISOString()
        });
      } else {
         socketService.emitToAdmins('admin:logout-notification', {
          customerId: userId,
          customerName: 'Unknown User',
          time: new Date().toISOString()
        });
      }

      // 5. Rời khỏi room và ngắt liên kết
      if (socket) {
        socket.leave(`customer:${userId}`);
      }
      socketService.unlinkCustomerSocket(userId);

      // 6. Ghi log
      const logMessage = customer ? `Session ended for ${customer.name}` : `Session ended for user ID ${userId}`;
      await systemLogService.log(
        'session',
        logMessage,
        { customer_id: userId, ip_address },
        'info'
      );
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
      console.error(`Error ending session for customer ${userId}:`, error);
      await systemLogService.error(
        'session',
        'Error ending session',
        { customer_id: userId, error },
        ip_address
      );
    }
  }
}

export default SessionService.getInstance(); 
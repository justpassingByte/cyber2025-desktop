import { Log } from '../models/log';
import databaseService from './database';

class LoggingService {
  private static instance: LoggingService;

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Ghi log vào database
   * @param entityType Loại entity (customer, session, transaction, etc.)
   * @param entityId ID của entity (nếu có)
   * @param action Hành động được thực hiện (login, logout, create, update, delete, etc.)
   * @param details Chi tiết bổ sung (dạng object)
   * @param userId ID của người dùng thực hiện hành động (nếu có)
   * @param ipAddress Địa chỉ IP (nếu có)
   * @param branchId ID của chi nhánh (nếu có)
   */
  public async log(
    entityType: string,
    action: string,
    details: Record<string, any> = {},
    entityId?: number,
    userId?: number,
    ipAddress?: string,
    branchId?: number
  ): Promise<Log> {
    try {
      const logRepository = databaseService.getRepository(Log);
      
      const newLog = new Log();
      newLog.entity_type = entityType;
      newLog.action = action;
      newLog.details_json = details;
      
      if (entityId) newLog.entity_id = entityId;
      if (userId) newLog.user_id = userId;
      if (ipAddress) newLog.ip_address = ipAddress;
      if (branchId) newLog.branch_id = branchId;
      
      return await logRepository.save(newLog);
    } catch (error) {
      console.error('Error logging to database:', error);
      throw error;
    }
  }

  /**
   * Lấy log theo điều kiện
   * @param options Các điều kiện tìm kiếm
   * @param limit Số lượng kết quả tối đa
   * @param offset Vị trí bắt đầu
   */
  public async getLogs(
    options: Partial<Log> = {},
    limit: number = 100,
    offset: number = 0
  ): Promise<[Log[], number]> {
    try {
      const logRepository = databaseService.getRepository(Log);
      return await logRepository.findAndCount({
        where: options,
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset
      });
    } catch (error) {
      console.error('Error retrieving logs:', error);
      throw error;
    }
  }
}

export default LoggingService.getInstance(); 
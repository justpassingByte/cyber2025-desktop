import database from './database';
import { SystemLog } from '../models/SystemLog';

/**
 * Loại levels cho SystemLog
 */
export type SystemLogLevel = 'info' | 'warning' | 'error' | 'critical';

/**
 * Loại categories cho SystemLog
 */
export type SystemLogCategory = 'app' | 'database' | 'security' | 'network' | 'config' | 'backup' | 'other';

class SystemLogService {
  private static instance: SystemLogService;
  
  private constructor() {}
  
  public static getInstance(): SystemLogService {
    if (!SystemLogService.instance) {
      SystemLogService.instance = new SystemLogService();
    }
    return SystemLogService.instance;
  }
  
  /**
   * Ghi log hệ thống với thông tin chi tiết
   */
  public async log(
    category: SystemLogCategory | string,
    message: string,
    details?: any,
    level: SystemLogLevel = 'info',
    ip_address?: string,
    branch_id?: number,
    staff_id?: number,
  ): Promise<SystemLog> {
    try {
      const systemLogRepo = database.getRepository(SystemLog);
      
      const log = systemLogRepo.create({
        level,
        category,
        message,
        details,
        ip_address,
        branch_id,
        staff_id
      });
      
      return await systemLogRepo.save(log);
    } catch (error) {
      console.error('Failed to save system log:', error);
      // Không ghi log lỗi khi gặp lỗi ghi log để tránh vòng lặp vô hạn
      return null as any;
    }
  }
  
  /**
   * Ghi log lỗi hệ thống
   */
  public async error(
    category: SystemLogCategory | string,
    message: string,
    error: Error | any,
    ip_address?: string,
    branch_id?: number,
    staff_id?: number
  ): Promise<SystemLog> {
    const details = {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    
    return this.log(
      category,
      message,
      details,
      'error',
      ip_address,
      branch_id,
      staff_id
    );
  }
  
  /**
   * Lấy logs hệ thống theo các điều kiện
   */
  public async getLogs(
    options: {
      level?: SystemLogLevel,
      category?: string,
      fromDate?: Date,
      toDate?: Date,
      branch_id?: number,
      staff_id?: number,
      limit?: number,
      offset?: number
    } = {}
  ): Promise<{ logs: SystemLog[], total: number }> {
    try {
      const systemLogRepo = database.getRepository(SystemLog);
      
      const query: any = {};
      if (options.level) query.level = options.level;
      if (options.category) query.category = options.category;
      if (options.branch_id) query.branch_id = options.branch_id;
      if (options.staff_id) query.staff_id = options.staff_id;
      
      let dateQuery = {};
      if (options.fromDate || options.toDate) {
        const timestampCondition: any = {};
        
        if (options.fromDate) {
          timestampCondition.gte = options.fromDate;
        }
        
        if (options.toDate) {
          timestampCondition.lte = options.toDate;
        }
        
        dateQuery = { timestamp: timestampCondition };
      }
      
      const [logs, total] = await systemLogRepo.findAndCount({
        where: { ...query, ...dateQuery },
        order: { timestamp: 'DESC' },
        take: options.limit || 100,
        skip: options.offset || 0
      });
      
      return { logs, total };
    } catch (error) {
      console.error('Failed to get system logs:', error);
      return { logs: [], total: 0 };
    }
  }
  
  /**
   * Xóa logs cũ theo số ngày
   */
  public async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const systemLogRepo = database.getRepository(SystemLog);
      const result = await systemLogRepo.createQueryBuilder()
        .delete()
        .where('timestamp < :cutoffDate', { cutoffDate })
        .execute();
      
      return result.affected || 0;
    } catch (error) {
      console.error('Failed to cleanup old system logs:', error);
      return 0;
    }
  }
}

export default SystemLogService.getInstance(); 
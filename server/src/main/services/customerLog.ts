import database from './database';
import { CustomerLog } from '../models/CustomerLog';

/**
 * Loại hoạt động cho CustomerLog
 */
export type CustomerAction = 
  'login' | 'logout' | 'session_start' | 'session_end' | 
  'topup' | 'payment' | 'food_order' | 'tournament_join' | 
  'reward_redeem' | 'profile_update' | 'other';

class CustomerLogService {
  private static instance: CustomerLogService;
  
  private constructor() {}
  
  public static getInstance(): CustomerLogService {
    if (!CustomerLogService.instance) {
      CustomerLogService.instance = new CustomerLogService();
    }
    return CustomerLogService.instance;
  }
  
  /**
   * Ghi log hoạt động của khách hàng
   */
  public async log(
    customer_id: number,
    action: CustomerAction | string,
    details?: any,
    ip_address?: string,
    computer_id?: number,
    session_id?: number,
    branch_id?: number,
    staff_id?: number
  ): Promise<CustomerLog> {
    try {
      const customerLogRepo = database.getRepository(CustomerLog);
      
      const log = customerLogRepo.create({
        customer_id,
        action,
        details,
        ip_address,
        computer_id,
        session_id,
        branch_id,
        staff_id
      });
      
      return await customerLogRepo.save(log);
    } catch (error) {
      console.error('Failed to save customer log:', error);
      return null as any;
    }
  }
  
  /**
   * Lấy logs hoạt động của khách hàng theo các điều kiện
   */
  public async getLogs(
    options: {
      customer_id?: number,
      action?: string,
      fromDate?: Date,
      toDate?: Date,
      computer_id?: number,
      session_id?: number,
      branch_id?: number,
      staff_id?: number,
      limit?: number,
      offset?: number
    } = {}
  ): Promise<{ logs: CustomerLog[], total: number }> {
    try {
      const customerLogRepo = database.getRepository(CustomerLog);
      
      const query: any = {};
      if (options.customer_id) query.customer_id = options.customer_id;
      if (options.action) query.action = options.action;
      if (options.computer_id) query.computer_id = options.computer_id;
      if (options.session_id) query.session_id = options.session_id;
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
      
      const [logs, total] = await customerLogRepo.findAndCount({
        where: { ...query, ...dateQuery },
        order: { timestamp: 'DESC' },
        take: options.limit || 100,
        skip: options.offset || 0
      });
      
      return { logs, total };
    } catch (error) {
      console.error('Failed to get customer logs:', error);
      return { logs: [], total: 0 };
    }
  }
  
  /**
   * Lấy timeline hoạt động của khách hàng
   */
  public async getCustomerTimeline(
    customer_id: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CustomerLog[]> {
    try {
      const customerLogRepo = database.getRepository(CustomerLog);
      
      const logs = await customerLogRepo.find({
        where: { customer_id },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset
      });
      
      return logs;
    } catch (error) {
      console.error(`Failed to get timeline for customer ${customer_id}:`, error);
      return [];
    }
  }
  
  /**
   * Xóa logs cũ theo số ngày
   */
  public async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const customerLogRepo = database.getRepository(CustomerLog);
      const result = await customerLogRepo.createQueryBuilder()
        .delete()
        .where('timestamp < :cutoffDate', { cutoffDate })
        .execute();
      
      return result.affected || 0;
    } catch (error) {
      console.error('Failed to cleanup old customer logs:', error);
      return 0;
    }
  }
}

export default CustomerLogService.getInstance(); 
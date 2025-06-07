import { ipcMain } from 'electron';
import database from '../services/database';
import { CustomerLog, SystemLog } from '../models';
import customerLogService from '../services/customerLog';
import systemLogService from '../services/systemLog';

export function registerLogHandlers() {
  // Lấy log hoạt động của 1 khách hàng cụ thể
  ipcMain.handle('logs:getCustomerTimeline', async (event, customerId, limit = 10, offset = 0) => {
    try {
      const customerLogRepo = database.getRepository(CustomerLog);
      
      const logs = await customerLogRepo.find({
        where: { customer_id: customerId },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset
      });
      
      return logs;
    } catch (error) {
      console.error('Error getting customer timeline:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  // Lấy log hệ thống (admin only)
  ipcMain.handle('logs:getSystemLogs', async (event, category = null, limit = 50, offset = 0) => {
    try {
      const systemLogRepo = database.getRepository(SystemLog);
      
      const whereClause = category ? { category } : {};
      
      const logs = await systemLogRepo.find({
        where: whereClause,
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset
      });
      
      return logs;
    } catch (error) {
      console.error('Error getting system logs:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });
  
  // Tạo ghi chú hệ thống (admin only)
  ipcMain.handle('logs:createSystemNote', async (event, message, category = 'note') => {
    try {
      await systemLogService.log(
        category,
        message,
        { timestamp: new Date().toISOString() },
        'info'
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error creating system note:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Lấy customer logs
  ipcMain.handle('logs:getCustomerLogs', async (event, options) => {
    try {
      return await customerLogService.getLogs(options);
    } catch (error) {
      console.error('Error getting customer logs:', error);
      return { logs: [], total: 0, error: error instanceof Error ? error.message : 'Lỗi không xác định' };
    }
  });

  // Dọn dẹp logs cũ
  ipcMain.handle('logs:cleanup', async (event, { systemLogDays, customerLogDays }) => {
    try {
      const systemResult = await systemLogService.cleanupOldLogs(systemLogDays);
      const customerResult = await customerLogService.cleanupOldLogs(customerLogDays);
      
      return { 
        success: true, 
        systemLogsRemoved: systemResult, 
        customerLogsRemoved: customerResult
      };
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    }
  });
} 
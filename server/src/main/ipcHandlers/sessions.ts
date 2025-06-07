import { ipcMain } from 'electron';
import database from '../services/database';

export function registerSessionHandlers() {
  ipcMain.handle('sessions:get', async (event, options = {}) => {
    try {
      const sessionRepo = database.getRepository('Session');
      let query: any = {};
      if (options.customerId) {
        query.where = { customer_id: options.customerId };
      }
      if (options.status) {
        query.where = { ...query.where, status: options.status };
      }
      if (options.limit) {
        query.take = options.limit;
      }
      query.order = { start_time: 'DESC' };
      const sessions = await sessionRepo.find(query);
      return { success: true, sessions };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return { success: false, error: 'Không thể lấy danh sách phiên chơi' };
    }
  });
} 
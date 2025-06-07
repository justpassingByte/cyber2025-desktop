import { ipcMain } from 'electron';
import database from '../services/database';
import topUpService from '../services/topup';
import { Customer } from '../models';

export function registerTransactionHandlers() {
  ipcMain.handle('transactions:get', async (event, options = {}) => {
    try {
      const customerId = options.customerId;
      const limit = options.limit || 20;
      
      const transactions = await topUpService.getTransactionHistory(
        customerId,
        limit
      );
      
      return { success: true, transactions };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return { success: false, error: 'Không thể lấy danh sách giao dịch' };
    }
  });
} 
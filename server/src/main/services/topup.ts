import database from './database';
import { Customer, Transaction } from '../models';
import customerLogService from './customerLog';
import systemLogService from './systemLog';
import socketService from './socket';
import { BrowserWindow } from 'electron';
import sessionManagerService from './sessionManagerService';

class TopupService {
  /**
   * Thực hiện nạp tiền cho khách hàng
   * Sử dụng raw SQL và queryRunner để tránh lỗi cyclic dependency
   */
  async topupByUsername(username: string, amount: number, message?: string): Promise<any> {
    // Lấy connection từ database
    const connection = database.getConnection();
    const queryRunner = connection.createQueryRunner();
    
    // Bắt đầu transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Bước 1: Tìm khách hàng bằng raw SQL
      const customerResults = await queryRunner.query(
        `SELECT * FROM customers WHERE name = ?`,
        [username]
      );
      
      // Kiểm tra khách hàng có tồn tại
      if (!customerResults || customerResults.length === 0) {
        throw new Error(`Không tìm thấy khách hàng với tên: ${username}`);
      }
      
      const customer = customerResults[0];
      
      // Bước 2: Tạo transaction record bằng raw SQL
      const now = new Date();
      const txResult = await queryRunner.query(
        `INSERT INTO transactions 
         (customer_id, amount, type, description, status, payment_method, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.id,
          amount,
          'topup',
          message || 'Nạp tiền',
          'completed',
          'cash',
          now
        ]
      );
      
      // Lấy ID của transaction vừa tạo
      const transactionId = txResult.insertId;
      
      // Bước 3: Cập nhật số dư khách hàng
      await queryRunner.query(
        `UPDATE customers SET balance = balance + ? WHERE id = ?`,
        [amount, customer.id]
      );
      
      // Bước 4: Lấy thông tin khách hàng đã cập nhật
      const updatedCustomerResults = await queryRunner.query(
        `SELECT * FROM customers WHERE id = ?`,
        [customer.id]
      );
      
      const updatedCustomer = updatedCustomerResults[0];
      
      // Bước 5: Lấy thông tin transaction để trả về
      const transactionResults = await queryRunner.query(
        `SELECT * FROM transactions WHERE id = ?`,
        [transactionId]
      );
      
      const transaction = transactionResults[0];
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      // Bước 6: Đồng bộ Session Manager, ghi log và gửi thông báo
      // Cập nhật trạng thái trong bộ nhớ của Session Manager NẾU khách hàng đang online
      sessionManagerService.updateSessionBalance(customer.id, updatedCustomer.balance);

      await this.logTransaction(
        customer.id,
        amount,
        transactionId,
        updatedCustomer.balance,
        message
      );
      
      // Gửi thông báo qua socket
      this.sendNotification(customer.id, amount, transaction);
      
      // Trả về kết quả thành công
      return {
        success: true,
        transaction: {
          _id: transactionId,
          username,
          amount,
          createdAt: transaction.created_at
        },
        customer: updatedCustomer
      };
      
    } catch (error) {
      // Rollback nếu có lỗi
      await queryRunner.rollbackTransaction();
      console.error("Topup error:", error);
      
      // Ghi log lỗi
      await systemLogService.log(
        'transaction',
        'Lỗi nạp tiền',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : '',
          username,
          amount
        },
        'error'
      );
      
      throw error;
    } finally {
      // Giải phóng queryRunner
      await queryRunner.release();
    }
  }

  /**
   * Ghi log nạp tiền
   */
  private async logTransaction(
    customerId: number,
    amount: number,
    transactionId: number,
    newBalance: number,
    message?: string
  ): Promise<void> {
    try {
      // Log vào customer log
      await customerLogService.log(
        customerId,
        'topup',
        {
          amount,
          transaction_id: transactionId,
          time: new Date().toISOString(),
          new_balance: newBalance,
          description: message || `Nạp tiền thủ công`,
          method: 'admin',
          admin_action: true
        }
      );
      
      // Log vào system log
      await systemLogService.log(
        'transaction',
        `Nạp tiền cho khách hàng ID: ${customerId}`,
        {
          customer_id: customerId,
          amount,
          transaction_id: transactionId,
          time: new Date().toISOString()
        },
        'info'
      );
    } catch (error) {
      console.error("Error logging transaction:", error);
    }
  }
  
  /**
   * Gửi thông báo nạp tiền
   */
  private sendNotification(customerId: number, amount: number, transaction: any): void {
    try {
      const notificationData = {
        transaction: {
          ...transaction
        },
        notification: `Tài khoản của bạn vừa được nạp ${amount.toLocaleString()} VND`
      };
      
      // Gửi thông báo qua socket service
      console.log('[TopupService] Emit to customer via socket:', customerId, notificationData);
      socketService.emitToCustomer(customerId, 'topup:completed', notificationData);
      
      console.log('[TopupService] Emit to admins via socket:', notificationData);
      socketService.emitToAdmins('admin:topup-notification', notificationData);
      
      // Gửi thông báo đến tất cả cửa sổ renderer
      const windows = BrowserWindow.getAllWindows();
      console.log(`[TopupService] Number of renderer windows: ${windows.length}`);
      windows.forEach((window: any, idx: number) => {
        if (!window.isDestroyed()) {
          console.log(`[TopupService] Send IPC topup:completed to renderer [window ${idx}]:`, notificationData);
          window.webContents.send('topup:completed', notificationData);
        } else {
          console.log(`[TopupService] Window ${idx} destroyed, skip IPC`);
        }
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
  
  /**
   * Lấy lịch sử giao dịch
   */
  async getTransactionHistory(customerId?: number, limit: number = 20): Promise<Transaction[]> {
    try {
      const connection = database.getConnection();
      let query = `
        SELECT t.* FROM transactions t
        ${customerId ? 'WHERE t.customer_id = ?' : ''}
        ORDER BY t.created_at DESC
        LIMIT ?
      `;
      
      const params = customerId ? [customerId, limit] : [limit];
      
      const transactions = await connection.query(query, params);
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }
}

export default new TopupService(); 
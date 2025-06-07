import express from 'express';
import database from '../services/database';
import { Customer, Transaction } from '../models';
import socketService from '../services/socket';
import authService from '../services/auth';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date()
  });
});

// Process top-up notification (cho bot hoặc hệ thống bên ngoài gọi)
router.post('/topup/notify', async (req, res) => {
  try {
    const { email, amount, message } = req.body;
    
    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Yêu cầu email/phone và số tiền'
      });
    }
    
    // Tìm customer
    const customerRepo = database.getRepository(Customer);
    const customer = await customerRepo.findOne({
      where: [
        { email },
        { phone: email }
      ]
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy khách hàng'
      });
    }
    
    // Tạo giao dịch nạp tiền
    const transactionRepo = database.getRepository(Transaction);
    const transaction = transactionRepo.create({
      customer,
      customer_id: customer.id,
      amount,
      type: 'topup',
      status: 'completed',
      payment_method: 'external',
      description: message || 'Nạp tiền qua hệ thống ngoài'
    });
    
    await transactionRepo.save(transaction);
    
    // Cập nhật số dư
    customer.balance += amount;
    await customerRepo.save(customer);
    
    // Gửi thông báo qua socket
    const notificationData = {
      transaction,
      notification: `Tài khoản của bạn vừa được nạp ${amount.toLocaleString()} VND`
    };
    
    // Gửi cho customer
    socketService.emitToCustomer(customer.id, 'topup:completed', notificationData);
    
    // Gửi cho admin
    socketService.emitToAdmins('admin:topup-notification', notificationData);
    
    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Error processing top-up:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể xử lý nạp tiền'
    });
  }
});

export default router; 
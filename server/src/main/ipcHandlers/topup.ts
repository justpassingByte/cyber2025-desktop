import { ipcMain, IpcMainInvokeEvent } from 'electron';
import topupService from '../services/topup';
import { authMiddleware, loggingMiddleware } from './middlewares';
import { getFullCustomerDetails } from './customers';
import socketService from '../services/socket';

// Xác thực đầu vào cho yêu cầu nạp tiền
const validateTopupRequest = (args: any) => {
  const { username, amount } = args;
  
  if (!username) {
    return 'Tên người dùng không được để trống';
  }
  
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return 'Số tiền nạp phải là một số dương';
  }
  
  return true;
};

// Xử lý nạp tiền
const handleProcessTopup = async (event: IpcMainInvokeEvent, args: any) => {
  const { username, amount, message } = args;
  
  try {
    // Gọi service xử lý nạp tiền
    const result = await topupService.topupByUsername(username, Number(amount), message);
    console.log(`Nạp tiền thành công cho ${username}: ${amount}`);
    
    // Sau khi nạp tiền thành công, lấy thông tin chi tiết và thông báo cho các admin
    if (result.success && result.customer) {
      const customerDetails = await getFullCustomerDetails(result.customer.id);
      if (customerDetails) {
        socketService.emitToAdmins('customer:updated', { customer: customerDetails });
      }
    }
    
    return result;
  } catch (error) {
    console.error('IPC topup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Lỗi nạp tiền không xác định' 
    };
  }
};

// Xử lý lấy lịch sử giao dịch
const handleTransactionHistory = async (event: IpcMainInvokeEvent, args: any) => {
  try {
    const { customerId, limit } = args || {};
    
    const transactions = await topupService.getTransactionHistory(
      customerId,
      limit || 20
    );
    
    return {
      success: true,
      transactions: transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        status: tx.status,
        description: tx.description,
        created_at: tx.created_at,
        customer_id: tx.customer_id,
        payment_method: tx.payment_method
      }))
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi khi lấy lịch sử giao dịch',
      transactions: []
    };
  }
};

export function registerTopupHandlers() {
  // Đăng ký handler cho endpoint cũ (process-topup)
  ipcMain.handle(
    'process-topup', 
    loggingMiddleware(
      authMiddleware(handleProcessTopup),
      'process-topup'
    )
  );

  // Đăng ký handler cho endpoint mới (topup:process)
  ipcMain.handle(
    'topup:process',
    loggingMiddleware(
      authMiddleware(handleProcessTopup),
      'topup:process'
    )
  );

  // Đăng ký handler cho endpoint lấy lịch sử giao dịch
  ipcMain.handle(
    'topup:history',
    loggingMiddleware(
      authMiddleware(handleTransactionHistory),
      'topup:history'
    )
  );
} 
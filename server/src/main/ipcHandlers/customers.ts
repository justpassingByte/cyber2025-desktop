import { ipcMain } from 'electron';
import database from '../services/database';
import authService from '../services/auth';
import { Customer, Transaction, Session } from '../models';
import customerLogService from '../services/customerLog';
import systemLogService from '../services/systemLog';
import socketService from '../services/socket';

// Helper function to get full customer details by ID
export async function getFullCustomerDetails(customerId: number) {
  const customerRepo = database.getRepository(Customer);
  
  const customer = await customerRepo.createQueryBuilder("customer")
    .where("customer.id = :id", { id: customerId })
    .leftJoinAndSelect("customer.sessions", "session")
    .getOne();
    
  if (!customer) return null;

  const transactionRepo = database.getRepository(Transaction);
  const stats = await transactionRepo.createQueryBuilder("transaction")
    .select("SUM(CASE WHEN transaction.type = 'topup' THEN transaction.amount ELSE 0 END)", "totalSpent")
    .where("transaction.customer_id = :id", { id: customerId })
    .andWhere("transaction.status = 'completed'")
    .getRawOne();
    
  const hoursPlayed = customer.sessions.reduce((total, session) => {
      if (session.start_time && session.end_time) {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return total + (duration / (1000 * 60 * 60));
      }
      return total;
  }, 0);

  const { password_hash, ...safeCustomer } = customer;

  return {
    ...safeCustomer,
    totalSpent: parseFloat(stats.totalSpent) || 0,
    hoursPlayed: Math.round(hoursPlayed),
    // Map snake_case to camelCase for client if necessary
  };
}

export function registerCustomerHandlers() {
  ipcMain.handle('customers:getAllDetails', async () => {
    try {
      const customerRepo = database.getRepository(Customer);
      
      // 1. Fetch all customers
      const customers = await customerRepo.find();
      if (customers.length === 0) {
        return { success: true, customers: [] };
      }
      const customerIds = customers.map(c => c.id);

      // 2. Fetch all transaction stats in one query
      const transactionStats = await database.getRepository(Transaction)
        .createQueryBuilder("transaction")
        .select("transaction.customer_id", "customerId")
        .addSelect("SUM(transaction.amount)", "totalSpent")
        .where("transaction.customer_id IN (:...customerIds)", { customerIds })
        .andWhere("transaction.status = 'completed'")
        .andWhere("transaction.type = 'topup'")
        .groupBy("transaction.customer_id")
        .getRawMany();

      // 3. Fetch all session stats in one query
      const sessionStats = await database.getRepository(Session)
        .createQueryBuilder("session")
        .select("session.customer_id", "customerId")
        // Use TIMESTAMPDIFF for MySQL to calculate duration in seconds
        .addSelect("SUM(TIMESTAMPDIFF(SECOND, session.start_time, session.end_time))", "totalSeconds")
        .where("session.customer_id IN (:...customerIds)", { customerIds })
        .andWhere("session.end_time IS NOT NULL")
        .groupBy("session.customer_id")
        .getRawMany();
      
      // Map stats for efficient lookup
      const statsMap = transactionStats.reduce((map, item) => {
        map[item.customerId] = { totalSpent: parseFloat(item.totalSpent) || 0 };
        return map;
      }, {});
      
      const sessionMap = sessionStats.reduce((map, item) => {
          map[item.customerId] = { hoursPlayed: Math.round((parseFloat(item.totalSeconds) || 0) / 3600) };
          return map;
      }, {});

      // 4. Combine data
      const detailedCustomers = customers.map(customer => {
        const { password_hash, ...safeCustomer } = customer;
        return {
            ...safeCustomer,
            totalSpent: statsMap[customer.id]?.totalSpent || 0,
            hoursPlayed: sessionMap[customer.id]?.hoursPlayed || 0,
        };
      });

      return { success: true, customers: detailedCustomers };
    } catch (error) {
      console.error('Error fetching all customer details:', error);
      return { success: false, error: 'Không thể lấy danh sách chi tiết khách hàng' };
    }
  });

  ipcMain.handle('customers:getAll', async () => {
    try {
      const customerRepo = database.getRepository(Customer);
      const customers = await customerRepo.find();
      const safeCustomers = customers.map(customer => {
        const { password_hash, ...safeCustomer } = customer;
        return safeCustomer;
      });
      return { success: true, customers: safeCustomers };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return { success: false, error: 'Không thể lấy danh sách khách hàng' };
    }
  });

  // Đăng ký handler cho 'sessions:get' để tránh lỗi không có handler
  ipcMain.handle('sessions:get', async (event, options = {}) => {
    // TODO: Trả về dữ liệu session thực tế nếu có
    return [];
  });

  ipcMain.handle('customers:create', async (event, customerData) => {
    try {
      console.log('Received create customer data:', customerData);
      const { name, password_hash, email, phone } = customerData;
      
      if (!name || !password_hash) {
        return { success: false, error: 'Missing required fields: name or password' };
      }
      
      const customerRepo = database.getRepository(Customer);
      
      // Check if customer already exists
      const existingCustomer = await customerRepo.findOne({ where: { name } });
      if (existingCustomer) {
        return { success: false, error: 'Customer already exists with this name' };
      }
      
      // Create new customer
      const customer = customerRepo.create({
        name,
        email: email || `${name}@cybercafe.com`, // Use provided email or generate default
        phone: phone || null,
        password_hash, // In production, should use proper hashing!
        balance: 0,
        points: 0
      });
      
      const savedCustomer = await customerRepo.save(customer);

      // Log customer creation
      await systemLogService.log(
        'customer',
        'Tạo khách hàng mới',
        {
          customer_id: savedCustomer.id,
          name: savedCustomer.name,
          time: new Date().toISOString()
        },
        'info'
      );

      // Notify admin clients that a new customer has been created
      const newCustomerDetails = await getFullCustomerDetails(savedCustomer.id);
      socketService.emitToAdmins('customer:created', { customer: newCustomerDetails });
      
      return { success: true, customer: newCustomerDetails };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('customers:getById', async (event, id) => {
    try {
      const customerRepo = database.getRepository(Customer);
      const customer = await customerRepo.findOne({ where: { id } });
      
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }
      
      return { success: true, customer };
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('customers:resetPassword', async (event, id) => {
    try {
      const customerRepo = database.getRepository(Customer);
      const customer = await customerRepo.findOne({ where: { id } });
      
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }
      
      // Reset password to "1"
      await customerRepo.update(id, { password_hash: "1" });
      
      // Log password reset
      await systemLogService.log(
        'security',
        'Đặt lại mật khẩu khách hàng',
        {
          customer_id: id,
          customer_name: customer.name,
          time: new Date().toISOString()
        },
        'warning'
      );
      
      // Emit update event so UI refreshes if needed
      const updatedCustomerDetails = await getFullCustomerDetails(id);
      if (updatedCustomerDetails) {
        socketService.emitToAdmins('customer:updated', { customer: updatedCustomerDetails });
      }

      return { success: true };
    } catch (error) {
      console.error('Error resetting customer password:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Update customer details
  ipcMain.handle('customers:update', async (event, id, customerData) => {
    try {
      console.log('[UPDATE DEBUG] Nhận yêu cầu update:', { id, customerData });
      const customerRepo = database.getRepository(Customer);
      const customer = await customerRepo.findOne({ where: { id } });
      if (!customer) {
        console.log('[UPDATE DEBUG] Không tìm thấy khách hàng với id:', id);
        return { success: false, error: 'Không tìm thấy khách hàng' };
      }
      const oldData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        dob: customer.dob || '',
        status: customer.status
      };
      const updateData = { ...customerData };
      console.log('[UPDATE DEBUG] Dữ liệu sẽ update:', updateData);
      await customerRepo.update(id, updateData);
      const updatedCustomer = await customerRepo.findOne({ where: { id } });
      console.log('[UPDATE DEBUG] Sau update, customer:', updatedCustomer);
      await customerLogService.log(
        id,
        'profile_update',
        {
          old_data: oldData,
          new_data: updateData,
          time: new Date().toISOString()
        }
      );

      // Emit the update to all admin clients
      const updatedCustomerDetails = await getFullCustomerDetails(id);
      if (updatedCustomerDetails) {
        socketService.emitToAdmins('customer:updated', { customer: updatedCustomerDetails });
      }
      
      return { success: true, customer: updatedCustomerDetails };
    } catch (error) {
      console.error('[UPDATE DEBUG] Lỗi khi update customer:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Lỗi cập nhật thông tin khách hàng' };
    }
  });

  // Delete customer
  ipcMain.handle('customers:delete', async (event, id) => {
    try {
      const customerRepo = database.getRepository(Customer);
      const customer = await customerRepo.findOne({ where: { id } });
      
      if (!customer) {
        return { success: false, error: 'Không tìm thấy khách hàng' };
      }
      
      // Lưu thông tin khách hàng trước khi xóa để ghi log
      const deletedCustomerInfo = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        balance: customer.balance,
        status: customer.status
      };
      
      // Xóa khách hàng
      await customerRepo.delete(id);
      
      // Ghi log xóa khách hàng
      await systemLogService.log(
        'customer',
        'Xóa khách hàng',
        {
          customer_info: deletedCustomerInfo,
          time: new Date().toISOString()
        },
        'warning'
      );
      
      // Emit delete event to admins
      socketService.emitToAdmins('customer:deleted', { customerId: id });

      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Lỗi xóa khách hàng' };
    }
  });
} 
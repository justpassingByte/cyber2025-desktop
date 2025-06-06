import { ipcMain } from 'electron';
import database from '../services/database';
import authService from '../services/auth';
import { Customer } from '../models';
import customerLogService from '../services/customerLog';
import systemLogService from '../services/systemLog';

export function registerCustomerHandlers() {
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

  ipcMain.handle('customers:create', async (event, name, password) => {
    try {
      const customerRepo = database.getRepository(Customer);
      
      // Check if customer already exists
      const existingCustomer = await customerRepo.findOne({ where: { name } });
      if (existingCustomer) {
        return { success: false, error: 'Customer already exists with this name' };
      }
      
      // Create new customer
      const customer = customerRepo.create({
        name,
        email: `${name}@cybercafe.com`, // Generate a default email
        password_hash: password, // In production, should use proper hashing!
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
      
      return { success: true, customer: savedCustomer };
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
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting customer password:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // Update customer details
  ipcMain.handle('customers:update', async (event, id, customerData) => {
    try {
      const customerRepo = database.getRepository(Customer);
      const customer = await customerRepo.findOne({ where: { id } });
      
      if (!customer) {
        return { success: false, error: 'Không tìm thấy khách hàng' };
      }
      
      // Lưu thông tin cũ để ghi log
      const oldData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        dob: customer.dob || ''
      };
      
      // Tạo đối tượng updateData
      const updateData = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || '',
        address: customerData.address || '',
        dob: customerData.dob || ''
      };
      
      // Cập nhật thông tin
      await customerRepo.update(id, updateData);
      
      // Lấy thông tin đã cập nhật
      const updatedCustomer = await customerRepo.findOne({ where: { id } });
      
      // Ghi log cập nhật thông tin
      await customerLogService.log(
        id,
        'profile_update',
        {
          old_data: oldData,
          new_data: updateData,
          time: new Date().toISOString()
        }
      );
      
      return { success: true, customer: updatedCustomer };
    } catch (error) {
      console.error('Error updating customer:', error);
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
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Lỗi xóa khách hàng' };
    }
  });
} 
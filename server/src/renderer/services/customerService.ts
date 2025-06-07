import { ipcRenderer } from 'electron';

// Interface cho danh sách khách hàng (list)
export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  memberSince: string;
  lastSeen: string;
}

// Interface cho chi tiết khách hàng
export interface CustomerDetail extends CustomerListItem {
  totalSpent: number;
  hoursPlayed: number;
  level: number;
  points: number;
  address?: string;
  dob?: string;
  avatarUrl?: string;
}

// Định nghĩa interface cho dữ liệu từ database
interface CustomerFromDB {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  points: number;
  balance: number;
  created_at: string;
  last_seen: string;
  address?: string | null;
  dob?: string | null;
  avatar_url?: string | null;
  is_suspended?: boolean;
  // Các trường khác từ database
}

interface FullCustomerFromDB extends CustomerFromDB {
  total_spent: number;
  hours_played: number;
}

interface TransactionFromDB {
  id: number;
  customer_id: number;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  // Các trường khác từ transaction
}

interface SessionFromDB {
  id: number;
  customer_id: number;
  start_time: string;
  end_time: string | null;
  status: string;
  // Các trường khác từ session
}

class CustomerService {
  // Lấy danh sách khách hàng (chỉ thông tin cơ bản)
  async getCustomers(): Promise<CustomerListItem[]> {
    try {
      console.log('[customerService] Calling getCustomers API');
      const result = await ipcRenderer.invoke('customers:getAll');
      console.log('[customerService] getCustomers response:', result);
      if (!result.success || !result.customers) {
        console.error('Failed to fetch customers:', result.error);
        return [];
      }
      return result.customers.map((customer: CustomerFromDB) => {
        const status = this.determineStatus(customer);
        return {
          id: customer.id.toString(),
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone || '',
          status,
          balance: customer.balance,
          memberSince: new Date(customer.created_at).toLocaleDateString('vi-VN'),
          lastSeen: customer.last_seen || '',
        };
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Lấy chi tiết khách hàng (CustomerDetail)
  async getCustomerDetail(id: string | number): Promise<CustomerDetail | null> {
    try {
      const customerId = typeof id === 'string' ? parseInt(id, 10) : id;
      const dbCustomer = await this.getCustomerById(customerId);
      if (!dbCustomer) return null;
      const totalSpent = await this.calculateTotalSpent(dbCustomer.id);
      const hoursPlayed = await this.calculateHoursPlayed(dbCustomer.id);
      const level = this.calculateLevel(dbCustomer.points);
      const lastSeen = dbCustomer.last_seen || (await this.getLastActivity(dbCustomer.id));
      const status = this.determineStatus(dbCustomer);
      return {
        id: dbCustomer.id.toString(),
        name: dbCustomer.name,
        email: dbCustomer.email || '',
        phone: dbCustomer.phone || '',
        status,
        balance: dbCustomer.balance,
        memberSince: new Date(dbCustomer.created_at).toLocaleDateString('vi-VN'),
        lastSeen,
        totalSpent,
        hoursPlayed,
        level,
        points: dbCustomer.points,
        address: dbCustomer.address || '',
        dob: dbCustomer.dob || '',
        avatarUrl: dbCustomer.avatar_url || '',   
      };
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      return null;
    }
  }

  // Tạo khách hàng mới (trả về CustomerDetail)
  async createCustomer(name: string, password: string, email?: string, phone?: string): Promise<CustomerDetail | null> {
    try {
      const result = await ipcRenderer.invoke('customers:create', {
        name,
        password_hash: password,
        email,
        phone
      });
      if (!result.success || !result.customer) {
        console.error('Failed to create customer:', result.error);
        return null;
      }
      // Sau khi tạo, lấy lại detail từ DB
      return await this.getCustomerDetail(result.customer.id);
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }

  // Nạp tiền cho khách hàng
  async topupCustomer(customerId: string, amount: number, message?: string): Promise<any> {
    try {
      const customerDetail = await this.getCustomerById(parseInt(customerId, 10));
      if (!customerDetail) {
        throw new Error('Không tìm thấy thông tin khách hàng');
      }
      const result = await ipcRenderer.invoke('process-topup', {
        email: customerDetail.email || customerDetail.phone || customerDetail.name,
        amount,
        message: message || `Nạp tiền cho khách hàng ${customerDetail.name}`,
        staffUserId: 1
      });
      return result;
    } catch (error) {
      console.error('Error processing topup:', error);
      throw error;
    }
  }

  // Các phương thức hỗ trợ
  async getCustomerById(id: number): Promise<CustomerFromDB | null> {
    try {
      const result = await ipcRenderer.invoke('customers:getById', id);
      if (!result.success || !result.customer) {
        console.error('Failed to fetch customer detail:', result.error);
        return null;
      }
      return result.customer;
    } catch (error) {
      console.error('Error fetching customer detail:', error);
      return null;
    }
  }

  private async calculateTotalSpent(customerId: number): Promise<number> {
    try {
      const result = await ipcRenderer.invoke('transactions:get', { customerId });
      if (!result.success || !result.transactions) {
        return 0;
      }
      return result.transactions.reduce((total: number, tx: TransactionFromDB) => {
        if (tx.type === 'charge' || tx.type === 'purchase') {
          return total + tx.amount;
        }
        return total;
      }, 0);
    } catch (error) {
      console.error('Error calculating total spent:', error);
      return 0;
    }
  }

  private async calculateHoursPlayed(customerId: number): Promise<number> {
    try {
      const result = await ipcRenderer.invoke('sessions:get', { customerId });
      if (!result.success || !result.sessions) {
        return 0;
      }
      let totalHours = 0;
      result.sessions.forEach((session: SessionFromDB) => {
        if (session.start_time) {
          const startTime = new Date(session.start_time);
          let endTime: Date;
          if (session.end_time) {
            endTime = new Date(session.end_time);
          } else if (session.status === 'active') {
            endTime = new Date();
          } else {
            return;
          }
          const durationMs = endTime.getTime() - startTime.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          totalHours += durationHours;
        }
      });
      return Math.round(totalHours);
    } catch (error) {
      console.error('Error calculating hours played:', error);
      return 0;
    }
  }

  private calculateLevel(points: number): number {
    const level = Math.floor(points / 100) + 1;
    return level;
  }

  private async getLastActivity(customerId: number): Promise<string> {
    try {
      const sessionsResult = await ipcRenderer.invoke('sessions:get', { 
        customerId,
        status: 'active',
        limit: 1
      });
      if (sessionsResult.success && sessionsResult.sessions && sessionsResult.sessions.length > 0) {
        return 'Đang online';
      }
      const logsResult = await ipcRenderer.invoke('logs:get', {
        entity_type: 'customer',
        entity_id: customerId,
        action: 'login',
        limit: 1
      });
      if (logsResult.success && logsResult.logs && logsResult.logs.length > 0) {
        return new Date(logsResult.logs[0].timestamp).toLocaleString('vi-VN');
      }
      return 'Chưa từng đăng nhập';
    } catch (error) {
      console.error('Error getting last activity:', error);
      return 'Không xác định';
    }
  }

  private determineStatus(customer: CustomerFromDB): 'active' | 'inactive' | 'suspended' {
    if (customer.is_suspended) {
      return 'suspended';
    }
    if (customer.last_seen && customer.last_seen !== 'Chưa hoạt động') {
      return 'active';
    }
    return 'inactive';
  }

  // Lấy danh sách khách hàng với đầy đủ chi tiết
  async getAllCustomerDetails(): Promise<CustomerDetail[]> {
    try {
      console.log('[customerService] Calling getAllCustomerDetails API');
      const result = await ipcRenderer.invoke('customers:getAllDetails');
      if (!result.success || !result.customers) {
        console.error('Failed to fetch customer details:', result.error);
        return [];
      }
      return result.customers.map((customer: FullCustomerFromDB) => {
        const status = this.determineStatus(customer);
        return {
          id: customer.id.toString(),
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone || '',
          status,
          balance: customer.balance,
          memberSince: new Date(customer.created_at).toLocaleDateString('vi-VN'),
          lastSeen: customer.last_seen ? new Date(customer.last_seen).toLocaleString('vi-VN') : 'Chưa từng thấy',
          totalSpent: customer.total_spent || 0,
          hoursPlayed: customer.hours_played || 0,
          level: this.calculateLevel(customer.points),
          points: customer.points,
          address: customer.address || '',
          dob: customer.dob ? new Date(customer.dob).toLocaleDateString('vi-VN') : '',
          avatarUrl: customer.avatar_url || '', 
        };
      });
    } catch (error) {
      console.error('Error fetching all customer details:', error);
      return [];
    }
  }
}

export default new CustomerService(); 
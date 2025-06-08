import { create } from 'zustand';
import customerService, { CustomerDetail } from '../services/customerService';

const { ipcRenderer } = window.require('electron');

type CustomerStatus = 'active' | 'suspended' | 'inactive';

interface CustomerState {
  customers: CustomerDetail[];
  loading: boolean;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: CustomerDetail) => void;
  updateCustomer: (customer: CustomerDetail) => void;
  deleteCustomer: (customerId: string | number) => void;
  updateCustomerStatus: (customerId: string | number, status: CustomerStatus) => void;
  updateCustomerSession: (customerId: string | number, data: { time_remaining: number; balance: number }) => void;
  getCustomerById: (customerId: string | number) => CustomerDetail | null;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: true,
  fetchCustomers: async () => {
    console.log('[Zustand] Fetching all customer details...');
    set({ loading: true });
    try {
      const initialCustomers = await customerService.getAllCustomerDetails();
      set({ customers: initialCustomers, loading: false });
      console.log('[Zustand] All customer details fetched successfully.');
    } catch (error) {
      console.error('[Zustand] Failed to fetch customer details:', error);
      set({ loading: false });
    }
  },
  addCustomer: (customer) => {
    console.log('[Zustand] Adding new customer to store:', customer);
    set(state => ({
      customers: state.customers.find(c => c.id === customer.id) 
        ? state.customers 
        : [...state.customers, customer]
    }));
  },
  updateCustomer: (customer) => {
    console.log('[Zustand] Updating customer in store:', customer);
    set(state => ({
      customers: state.customers.map(c => c.id === customer.id ? customer : c)
    }));
  },
  deleteCustomer: (customerId) => {
    console.log('[Zustand] Deleting customer from store:', customerId);
    set(state => ({
      customers: state.customers.filter(c => c.id.toString() !== customerId.toString())
    }));
  },
  updateCustomerStatus: (customerId, status) => {
    console.log(`[Zustand] Updating status for ${customerId} to ${status}`);
    set(state => ({
      customers: state.customers.map(c =>
        c.id.toString() === customerId.toString()
          ? { ...c, status }
          : c
      ),
    }));
  },
  updateCustomerSession: (customerId, data) => {
    set(state => ({
      customers: state.customers.map(c =>
        c.id.toString() === customerId.toString()
          ? { ...c, balance: data.balance }
          : c
      ),
    }));
  },
  getCustomerById: (customerId) => {
    const idStr = customerId.toString();
    return get().customers.find(c => c.id === idStr) || null;
  }
}));

// Initialize the store and its listeners right away
function initializeStore() {
  console.log('[Zustand] Initializing store and listeners...');
  const store = useCustomerStore.getState();
  
  // Fetch initial data
  store.fetchCustomers();

  // Setup IPC listener for status changes
  const handleStatusChange = (_event: any, data: { customer_id: string | number; status: string }) => {
    console.log(`[Zustand] Received customer:status-changed event`, data);
    useCustomerStore.getState().updateCustomerStatus(data.customer_id, data.status as CustomerStatus);
  };

  // Setup IPC listener for new customers
  const handleCustomerCreated = (_event: any, data: { customer: CustomerDetail }) => {
      console.log(`[Zustand] Received customer:created event`, data);
      if(data.customer) {
        useCustomerStore.getState().addCustomer(data.customer);
      }
  };
  
  // Setup IPC listener for updated customers (e.g., after topup)
  const handleCustomerUpdated = (_event: any, data: { customer: CustomerDetail }) => {
      console.log(`[Zustand] Received customer:updated event`, data);
      if(data.customer) {
        useCustomerStore.getState().updateCustomer(data.customer);
      }
  };

  // Setup IPC listener for deleted customers
  const handleCustomerDeleted = (_event: any, data: { customerId: string | number }) => {
    console.log(`[Zustand] Received customer:deleted event`, data);
    if(data.customerId) {
      useCustomerStore.getState().deleteCustomer(data.customerId);
    }
  };

  // Setup IPC listener for session updates
  const handleSessionUpdate = (_event: any, data: { customerId: string | number, time_remaining: number, balance: number }) => {
    console.log(`[Zustand] Received session:update event`, data);
    if(data.customerId) {
        useCustomerStore.getState().updateCustomerSession(data.customerId, {
            time_remaining: data.time_remaining,
            balance: data.balance
        });
    }
  };

  ipcRenderer.on('customer:status-changed', handleStatusChange);
  ipcRenderer.on('customer:created', handleCustomerCreated);
  ipcRenderer.on('customer:updated', handleCustomerUpdated);
  ipcRenderer.on('customer:deleted', handleCustomerDeleted);
  ipcRenderer.on('session:update', handleSessionUpdate);

  // We could add cleanup here if the app had a true "shutdown" event from the renderer side
}

initializeStore(); 
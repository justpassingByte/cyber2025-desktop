import { IpcMainInvokeEvent } from 'electron';

/**
 * Middleware xác thực cho các IPC handler
 * Đây là một wrapper đơn giản để kiểm tra quyền truy cập
 * Có thể mở rộng sau này để kiểm tra session, role, v.v.
 */
export const authMiddleware = (handler: Function) => {
  return async (event: IpcMainInvokeEvent, ...args: any[]) => {
    // Có thể thêm logic xác thực ở đây
    // Ví dụ: kiểm tra session, token, quyền, v.v.
    
    // Trong trường hợp đơn giản, chỉ chuyển tiếp đến handler
    return handler(event, ...args);
  };
};

/**
 * Middleware ghi log cho các IPC handler
 */
export const loggingMiddleware = (handler: Function, handlerName: string) => {
  return async (event: IpcMainInvokeEvent, ...args: any[]) => {
    console.log(`[IPC] Calling ${handlerName} with args:`, args);
    
    try {
      // Gọi handler gốc
      const result = await handler(event, ...args);
      
      // Log kết quả nếu cần
      if (process.env.NODE_ENV === 'development') {
        console.log(`[IPC] ${handlerName} completed successfully`);
      }
      
      return result;
    } catch (error) {
      console.error(`[IPC] Error in ${handlerName}:`, error);
      throw error;
    }
  };
};

/**
 * Middleware đảm bảo dữ liệu hợp lệ
 */
export const validationMiddleware = (handler: Function, validator: Function) => {
  return async (event: IpcMainInvokeEvent, ...args: any[]) => {
    // Kiểm tra đầu vào hợp lệ
    const validationResult = validator(...args);
    if (validationResult !== true) {
      return {
        success: false,
        error: validationResult || 'Dữ liệu không hợp lệ'
      };
    }
    
    // Nếu hợp lệ, tiếp tục gọi handler
    return handler(event, ...args);
  };
}; 
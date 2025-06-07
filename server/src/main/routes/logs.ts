import { ipcMain } from 'electron';
import loggingService from '../services/logging';
import { Log } from '../models/log';

// Register log-related IPC handlers
export function registerLogHandlers() {
  // Get logs with filtering
  ipcMain.handle('logs:get', async (event, options: {
    limit?: number;
    offset?: number;
    entity_type?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) => {
    try {
      const { limit = 10, offset = 0, entity_type, action, startDate, endDate, search } = options;

      // Build filter conditions
      const filter: any = {};
      
      if (entity_type) {
        filter.entity_type = entity_type;
      }
      
      if (action) {
        filter.action = action;
      }
      
      // Apply date range filtering in application code since SQLite doesn't support complex date filtering
      const [logs, total] = await loggingService.getLogs(filter, limit, offset);
      
      // Filter by date range if provided
      let filteredLogs = logs;
      if (startDate || endDate) {
        filteredLogs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          
          if (startDate && endDate) {
            return logDate >= new Date(startDate) && logDate <= new Date(endDate);
          } else if (startDate) {
            return logDate >= new Date(startDate);
          } else if (endDate) {
            return logDate <= new Date(endDate);
          }
          
          return true;
        });
      }
      
      // Apply text search if provided
      if (search && search.trim() !== '') {
        const searchTerm = search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => {
          // Search in entity_type, action, and details_json
          return (
            log.entity_type?.toLowerCase().includes(searchTerm) ||
            log.action?.toLowerCase().includes(searchTerm) ||
            (log.details_json && JSON.stringify(log.details_json).toLowerCase().includes(searchTerm))
          );
        });
      }

      return {
        logs: filteredLogs,
        total: filteredLogs.length // For simple implementation, return filtered count
      };
    } catch (error) {
      console.error('Error retrieving logs:', error);
      return {
        logs: [],
        total: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });

  // Create a new log entry
  ipcMain.handle('logs:create', async (event, logData: Partial<Log>) => {
    try {
      const { entity_type, action, entity_id, details_json, user_id, ip_address, branch_id } = logData;
      
      if (!entity_type || !action) {
        throw new Error('entity_type and action are required fields');
      }
      
      const log = await loggingService.log(
        entity_type,
        action,
        details_json || {},
        entity_id,
        user_id,
        ip_address,
        branch_id
      );
      
      return { success: true, log };
    } catch (error) {
      console.error('Error creating log:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });
} 
import React, { useState, useEffect } from 'react';
import { Log } from '../../../main/models/log';
import { ipcRenderer } from 'electron';
import { Button } from '../../components/ui';

interface LogsFilter {
  entity_type?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

interface LogsResponse {
  logs: Log[];
  total: number;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<LogsFilter>({});

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await ipcRenderer.invoke('logs:get', {
        ...filter,
        // Nếu muốn phân trang, bổ sung limit/offset ở đây
      }) as LogsResponse;
      setLogs(response.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilter({
      ...filter,
      [key]: value
    });
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleReset = () => {
    setFilter({});
    fetchLogs();
  };

  const entityTypeOptions = [
    { label: 'Khách hàng', value: 'customer' },
    { label: 'Giao dịch', value: 'transaction' },
    { label: 'Phiên', value: 'session' },
    { label: 'Hệ thống', value: 'system' }
  ];

  const actionOptions = [
    { label: 'Đăng nhập', value: 'login' },
    { label: 'Đăng ký', value: 'registration' },
    { label: 'Nạp tiền', value: 'topup_completed' },
    { label: 'Lỗi nạp tiền', value: 'topup_failed' },
    { label: 'Bắt đầu phiên', value: 'session_start' },
    { label: 'Kết thúc phiên', value: 'session_end' }
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: 'Đối tượng',
      dataIndex: 'entity_type',
      render: (text: string) => {
        const entity = entityTypeOptions.find(e => e.value === text);
        return entity ? entity.label : text;
      }
    },
    {
      title: 'ID đối tượng',
      dataIndex: 'entity_id',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (text: string) => {
        const action = actionOptions.find(a => a.value === text);
        return action ? action.label : text;
      }
    },
    {
      title: 'Chi tiết',
      dataIndex: 'details_json',
      render: (json: Record<string, any>) => {
        try {
          return <pre style={{ maxHeight: '100px', overflow: 'auto' }}>{JSON.stringify(json, null, 2)}</pre>;
        } catch (e) {
          return String(json);
        }
      }
    },
    {
      title: 'User ID',
      dataIndex: 'user_id'
    },
    {
      title: 'IP',
      dataIndex: 'ip_address'
    }
  ];

  return (
    <div className="logs-container">
      <h2>Nhật ký hệ thống</h2>
      
      <div className="filter-container" style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <select
          style={{ width: 150 }}
          value={filter.entity_type || ''}
          onChange={e => handleFilterChange('entity_type', e.target.value)}
        >
          <option value="">Loại đối tượng</option>
          {entityTypeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        
        <select
          style={{ width: 150 }}
          value={filter.action || ''}
          onChange={e => handleFilterChange('action', e.target.value)}
        >
          <option value="">Hành động</option>
          {actionOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        
        <input
          type="date"
          style={{ width: 130 }}
          onChange={e => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
        />
        
        <input
          type="date"
          style={{ width: 130 }}
          onChange={e => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
        />
        
        <input
          placeholder="Tìm kiếm..."
          style={{ width: 200 }}
          value={filter.search || ''}
          onChange={e => handleFilterChange('search', e.target.value)}
        />
        
        <Button onClick={handleSearch}>Lọc</Button>
        <Button onClick={handleReset}>Đặt lại</Button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Thời gian</th>
              <th>Đối tượng</th>
              <th>ID đối tượng</th>
              <th>Hành động</th>
              <th>Chi tiết</th>
              <th>User ID</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{entityTypeOptions.find(e => e.value === log.entity_type)?.label || log.entity_type}</td>
                <td>{log.entity_id}</td>
                <td>{actionOptions.find(a => a.value === log.action)?.label || log.action}</td>
                <td>
                  <pre style={{ maxHeight: '100px', overflow: 'auto' }}>{JSON.stringify(log.details_json, null, 2)}</pre>
                </td>
                <td>{log.user_id}</td>
                <td>{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemLogs; 
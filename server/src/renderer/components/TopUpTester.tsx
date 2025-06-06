import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

const TopUpTester: React.FC = () => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setResult(null);
      
      if (!username || !amount) {
        setError('Tên người dùng và số tiền là bắt buộc');
        return;
      }
      
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        setError('Số tiền phải là một số dương');
        return;
      }
      
      // Send to main process
      const result = await ipcRenderer.invoke('process-topup', {
        username,
        amount: amountNumber,
        message: message || 'Kiểm tra nạp tiền'
      });
      
      setResult(result);
      
      if (result.success) {
        setUsername('');
        setAmount('');
        setMessage('');
      } else {
        setError(result.error || 'Đã xảy ra lỗi không xác định');
      }
    } catch (err) {
      console.error('Top-up error:', err);
      setError('Đã xảy ra lỗi khi xử lý');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Kiểm Tra Nạp Tiền</h2>
      <form onSubmit={handleTopUp} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Tên người dùng
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập tên người dùng"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Số tiền
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập số tiền"
            min="1000"
            step="1000"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Nhập ghi chú (tuỳ chọn)"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nạp Tiền
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {result?.success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          Nạp tiền thành công! ID giao dịch: {result.transaction._id}
        </div>
      )}
    </div>
  );
};

export default TopUpTester; 
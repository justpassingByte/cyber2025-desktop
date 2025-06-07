# Cybercafe Management System

## Overview
This project is a modern Cybercafe Management System built with Next.js, React, TypeScript, and Electron. It provides a comprehensive dashboard for both administrators and customers to manage games, food & drinks, tournaments, rewards, and user profiles. The system is designed for performance, accessibility, and a seamless user experience.

## System Architecture

### Kiến trúc tổng quan

```
+----------------+     +------------------+     +---------------+
|  Client WebApp |<--->| Electron Renderer|<--->| Electron Main |
+----------------+     +------------------+     +---------------+
       ^                                              |
       |                                              |
       v                                              v
+----------------+                             +---------------+
| Socket.IO      |<--------------------------->| Database      |
+----------------+                             |   (MySQL)     |
       ^                                       +---------------+
       |                                              ^
       |                                              |
       v                                              v
+----------------+                                    |
| HTTP API       |------------------------------------+
| (cho bot)      |
+----------------+
```

### Luồng dữ liệu trong hệ thống

1. **Lưu trữ dữ liệu + Logs**:
   - Tất cả dữ liệu (customer, transaction, session) lưu trực tiếp vào MySQL
   - Logs ghi trực tiếp vào database qua Log entity
   - Không cần API cho việc lưu log nội bộ

2. **Giao tiếp với Client**:
   - Socket.IO: Kết nối real-time để thông báo (login, topup, notifications)
   - Client giao tiếp với server qua Socket.IO events

3. **Giao tiếp Renderer/Main**:
   - IPC (Inter-Process Communication) giữa renderer và main process
   - Các thao tác CRUD được thực hiện qua IPC handlers

4. **API cho Bot**:
   - HTTP API được giữ lại cho bot bên ngoài sử dụng
   - Endpoints: `/api/customers`, `/api/transactions`, `/api/topup/notify`

### Chi tiết luồng dữ liệu cho các use case chính:

1. **Đăng nhập**:
   - Client → Socket.IO (`auth:login`) → Main Process → Database → Log
   - Phản hồi: Database → Main → Socket.IO → Client
   - Thông báo: Main → Socket.IO → Admin Dashboard

2. **Nạp tiền**:
   - Admin → IPC (`process-topup`) → Main Process → Database → Log
   - Hoặc: Bot → HTTP API (`/api/topup/notify`) → Main Process → Database → Log
   - Thông báo: Main → Socket.IO → Client + Admin Dashboard

3. **Xem log**:
   - Admin → IPC (`logs:get`) → Main Process → Database → Admin

4. **Khởi động ứng dụng**:
   - Main Process → Database (connect) → Log (app_start)
   - Socket.IO server khởi chạy
   - HTTP server khởi chạy (cho bot)

## Database Design

Hệ thống sử dụng MySQL với TypeORM để quản lý dữ liệu. Cấu trúc database thực tế:

```
+------------+     +-----------+     +-----------+
|  Branch    |<----| Computer  |<----| Session   |
+------------+     +-----------+     +-----------+
      ^                ^                ^    ^
      |                |                |    |
+------------+   +-----------+     +-----------+
|   Staff    |   |  Combo    |     | Customer  |
+------------+   +-----------+     +-----------+
      |                |                  |
      v                |                  v
+------------+         |            +-----------+
|CustomerLog |         |            |Transaction|
+------------+         |            +-----------+
      |                |                  |
      v                |                  v
+------------+         |            +-----------+
| SystemLog  |<--------+            |  Rewards   |
+------------+         |            +-----------+
      ^                |                  |
      |                v                  |
+-----------+     +-----------+           |
|   Games   |<----|  Events   |-----------+
+-----------+     +-----------+
      ^
      |
+-----------+
| Inventory |
+-----------+
      ^
      |
+-----------------+
|   FoodDrink     |
+-----------------+
      ^
      |
+-----------------+
| MenuCategory    |
+-----------------+
      ^
      |
+-----------------+
|   ComboDetail   |
+-----------------+
```

**Các model chính:**
- `Branch`, `Computer`, `Session`, `Staff`, `Customer`, `Transaction`, `Log`, `Inventory`, `FoodDrink`, `MenuCategory`, `Combo`, `ComboDetail`
- `CustomerLog`: Ghi lại tất cả hoạt động của khách hàng (đăng nhập, đăng xuất, nạp tiền, sử dụng dịch vụ, v.v.)
- `SystemLog`: Ghi lại các sự kiện hệ thống (khởi động, lỗi, cảnh báo, cài đặt, v.v.)

## Features
- **Admin Dashboard**: Monitor active users, revenue, stations, and peak hours.
- **Game Management**: Install, update, and manage games with real-time stats.
- **Food & Drink Management**: Track inventory, sales, and profits; manage menu items.
- **Customer Portal**: Order food & drinks, view tournaments, track rewards, and manage profiles.
- **Tournaments**: Register, view rankings, and see results for gaming tournaments.
- **Rewards & Achievements**: Earn and redeem rewards, track achievements and XP.
- **Profile Management**: Edit personal info, view gaming stats, and manage account settings.
- **Responsive UI**: Optimized for both desktop and mobile devices.
- **Performance & Linting**: Uses Next.js `<Image />` for optimized images and follows strict linting rules for code quality.
- **System Logging**: Comprehensive logging system that records all user actions and system events.
- **Automated XAMPP Setup**: Built-in installer that sets up XAMPP database automatically.
- **Activity Tracking**: Chi tiết theo dõi mọi hoạt động của khách hàng và hệ thống.

## Project Structure

```
cybercafe-desktop/
└── server/
    ├── installer/           # XAMPP installer scripts
    │   └── windows/         # Windows-specific installer scripts
    └── src/
        ├── main/
        │   ├── models/      # Database models (customer, transaction, session, ...)
        │   ├── routes/      # API and IPC route handlers
        │   ├── services/    # Business logic, database, XAMPP, auth, logging, ...
        │   └── main.ts      # Electron main process entry
        │   └── setup.ts     # First-run/setup logic
        └── renderer/
            ├── components/  # UI components (including /ui primitives)
            ├── pages/       # Pages (dashboard, foods, games, room, customers, settings, ...)
            ├── services/    # Renderer-specific services
            ├── lib/         # Utility libraries
            └── styles/      # Styles (Tailwind, custom CSS)
```

## Công nghệ sử dụng
- **Next.js** (App Router)
- **React** (with hooks, functional components)
- **TypeScript**
- **Electron** (Desktop application)
- **MySQL** (Database)
- **TypeORM** (ORM framework)
- **Socket.IO** (Real-time communication)
- **Express** (HTTP API for bots)
- **Tailwind CSS** (utility-first styling)

## Installation Options

### Option 1: Using the Installer (Recommended)

The easiest way to get started is to download and run our installer:

1. Download the latest installer from the releases page
2. Run the installer and follow the on-screen instructions
3. The installer will:
   - Install the Cybercafe Management application
   - Download and install XAMPP if not already present
   - Set up the MySQL database automatically
   - Create desktop shortcuts
## Development Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)
   
## Building the Application

### Building for development
```bash
cd cybercafe-desktop/server
npm run dev
```

### Building an installer
```bash
cd cybercafe-desktop/server
npm run build:package
```

This will create installers in the `release` folder.

### Building for specific platforms
```bash
# Build for Windows
npm run build:package:win

# Build for all platforms (Windows, macOS, Linux)
npm run package:all
```

## Bot Integration
External bots can interact with the system using the HTTP API:
- **GET /api/customers** - List all customers
- **POST /api/customers** - Create a new customer
- **GET /api/transactions** - List transactions
- **POST /api/topup/notify** - Process top-up notification

## Linting & Best Practices
- Uses ESLint with TypeScript and React rules.
- Warnings for unescaped characters (e.g., apostrophes) and unused variables are fixed.
- All `<img>` tags are replaced with Next.js `<Image />` for performance.
- Type safety is enforced (no `any` types in components).

## Hệ thống Nhật ký và Logging

### Phân loại Logs

Hệ thống phân chia logs thành hai loại chính:

1. **System Logs**: Ghi lại các sự kiện hệ thống
   - `app_start`: Khởi động ứng dụng
   - `app_shutdown`: Tắt ứng dụng
   - `database_connection`: Kết nối/ngắt kết nối với database
   - `error`: Các lỗi hệ thống
   - `warning`: Cảnh báo hệ thống
   - `config_change`: Thay đổi cấu hình
   - `backup`: Sao lưu dữ liệu
   - `restore`: Khôi phục dữ liệu

2. **Customer Activity Logs**: Ghi lại hoạt động của khách hàng
   - `login`: Đăng nhập
   - `logout`: Đăng xuất
   - `session_start`: Bắt đầu phiên sử dụng máy
   - `session_end`: Kết thúc phiên sử dụng máy
   - `topup`: Nạp tiền
   - `payment`: Thanh toán dịch vụ
   - `food_order`: Đặt đồ ăn/uống
   - `tournament_join`: Tham gia giải đấu
   - `reward_redeem`: Đổi phần thưởng
   - `profile_update`: Cập nhật thông tin cá nhân

### Cấu trúc Log

**SystemLog:**
```typescript
{
  id: number;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string; // app, database, security, etc.
  message: string;
  details: any; // JSON data
  ip_address?: string;
  branch_id?: number;
  staff_id?: number;
}
```

**CustomerLog:**
```typescript
{
  id: number;
  timestamp: Date;
  customer_id: number;
  action: string; // login, topup, order, etc.
  details: any; // JSON data
  ip_address?: string;
  computer_id?: number;
  session_id?: number;
  branch_id?: number;
  staff_id?: number; // Nếu có nhân viên liên quan đến hành động
}
```

### Cách sử dụng Logging service

```typescript
// Ghi log hệ thống
systemLogService.log('database', 'connection_success', {
  database: 'cybercafe',
  host: 'localhost'
});

// Ghi log hoạt động khách hàng
customerLogService.log(customer.id, 'topup', {
  amount: 100000,
  payment_method: 'cash',
  staff_id: 1
});
```

### Xem và phân tích logs

Quản trị viên có thể xem và phân tích logs thông qua:

1. **Dashboard Logs**: Hiển thị các sự kiện quan trọng và thông tin thống kê
2. **Logs Explorer**: Công cụ tìm kiếm và lọc logs theo nhiều tiêu chí
3. **Customer Activity Timeline**: Xem dòng thời gian hoạt động của từng khách hàng
4. **Export Logs**: Xuất logs ra file CSV hoặc JSON để phân tích ngoại tuyến
5. **Log Alerts**: Cấu hình cảnh báo khi có sự kiện bất thường

### Bảo mật và Lưu trữ Logs

- Logs được mã hóa khi lưu trữ thông tin nhạy cảm
- Tự động xóa logs cũ theo chính sách lưu trữ có thể cấu hình (mặc định 90 ngày)
- Sao lưu logs theo lịch trình định kỳ
- Khả năng xuất logs tới hệ thống giám sát bên ngoài

---
Feel free to contribute or customize for your own cybercafe or gaming lounge! 
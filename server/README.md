# CyberCafe Admin Server

Ứng dụng desktop quản lý cho các quán net, cybercafe. Đây là phần mềm máy chủ dùng để quản lý hoạt động của quán net từ máy tính quản lý.

## Tính năng

- Hiển thị tổng quan về hoạt động của quán net
- Theo dõi trạng thái của từng máy tính
- Quản lý người dùng và phiên làm việc
- Thống kê doanh thu và hoạt động

## Cài đặt

```bash
# Clone repository
git clone [repository-url]

# Vào thư mục server
cd cybercafe-desktop/server

# Cài đặt dependencies
npm install

# Build ứng dụng
npm run build

# Chạy ứng dụng
npm start
```

## Phát triển

```bash
# Chạy chế độ development
npm run dev

# Hoặc chạy riêng Electron nếu đã có file build
npm run dev-only
```

## Cấu trúc project

```
server/
├── dist/               # Thư mục build
├── src/
│   ├── main/           # Mã nguồn cho main process
│   │   └── main.ts
│   └── renderer/       # Mã nguồn cho renderer process (React)
│       ├── components/ # React components
│       ├── pages/      # React pages
│       ├── styles/     # CSS styles
│       ├── App.tsx     # Main React component
│       ├── index.html  # HTML template
│       └── index.tsx   # React entry point
├── package.json        # Project metadata và dependencies
├── tsconfig.json       # TypeScript configuration
├── webpack.config.js   # Webpack configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Môi trường

- Node.js 18+
- Electron 30+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+

## Xây dựng phần mềm

```bash
# Build cho Windows
npm run build -- --win

# Build cho macOS
npm run build -- --mac

# Build cho Linux
npm run build -- --linux
``` 
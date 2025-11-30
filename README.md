# 🎓 MTP - Meeting Tutoring Platform

[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)](https://expressjs.com/)

---

## 🌟 Tính năng

- 🔐 **Xác thực CAS**: Đăng nhập thông qua CAS server giả lập HCMUT SSO
- 👨‍🎓 **Student**: Đăng ký, xem và hủy buổi học
- 👨‍🏫 **Tutor**: Tạo và quản lý buổi gặp, lịch trống
- � **Dashboard**: Theo dõi buổi học và thống kê
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị

---

## 🏗️ Kiến trúc

```
CAS Server (Port 4000) ◄──► Backend (Port 3001) ◄──► Frontend (Port 3002)
   [Authentication]           [REST API]              [UI/Static Files]
```

---

## 💻 Công nghệ

**Backend**: Node.js, Express.js, cookie-session, axios, xml2js  
**Frontend**: HTML5, CSS3, Vanilla JavaScript  
**CAS Server**: Express.js, EJS, uuid

---

## 🚀 Cài đặt & Chạy

### 1. Clone project

```bash
git clone https://github.com/nhunguyen133/mtp-cnpm-251.git
cd mtp-cnpm-251
```

### 2. Cài đặt dependencies

```bash
# CAS Server
cd sso-cas-server
npm install

# Backend
cd ../mtp-backend
npm install

# Frontend
cd ../mtp-frontend
npm install
```

### 3. Chạy ứng dụng

**Cách 1: Chạy tất cả cùng lúc (PowerShell - Windows)**
```powershell
./run-all.ps1
```

**Cách 2: Chạy từng service (3 terminals riêng)**
```bash
# Terminal 1: CAS Server
cd sso-cas-server && npm start

# Terminal 2: Backend
cd mtp-backend && npm start

# Terminal 3: Frontend
cd mtp-frontend && npm start
```

### 4. Truy cập ứng dụng

Mở trình duyệt: **http://localhost:3002**

---

## � Tài khoản test

### �‍🎓 Sinh viên
- Email: `nhu.nguyen` / Password: `123456`
- Email: `mai.nguyen` / Password: `123456`

### 👨‍� Tutor
- Email: `mdtrung` / Password: `123456`
- Email: `ldthuan` / Password: `123456`

---

## � API Endpoints

### Authentication
```
GET  /api/auth/login      - Redirect to CAS login
GET  /api/auth/callback   - Validate CAS ticket
GET  /api/auth/me         - Get current user
GET  /api/auth/logout     - Logout
```

### Student
```
GET  /api/student/sessions          - Xem buổi học có thể đăng ký
GET  /api/student/my-sessions       - Xem buổi đã đăng ký
POST /api/student/sessions/:id      - Đăng ký buổi học
DEL  /api/student/sessions/:id      - Hủy đăng ký
```

### Tutor
```
GET  /api/tutor/meetings            - Xem buổi gặp của mình
POST /api/tutor/meetings            - Tạo buổi gặp mới
PUT  /api/tutor/meetings/:id        - Cập nhật buổi gặp
GET  /api/tutor/meetings/:id/students - Xem danh sách SV đăng ký
```

---

## 📁 Cấu trúc

```
mtp-cnpm-251/
├── sso-cas-server/        # CAS Authentication (Port 4000)
│   ├── src/
│   │   ├── casRoutes.js   # CAS protocol
│   │   └── users.js       # User database
│   └── views/
│       └── login.ejs      # Login page
│
├── mtp-backend/           # Backend API (Port 3001)
│   ├── data/              # Mock database
│   ├── middleware/
│   │   └── auth.js        # Authorization
│   └── server.js          # REST API
│
└── mtp-frontend/          # Frontend (Port 3002)
    └── public/
        ├── student/       # Student pages
        ├── tutor/         # Tutor pages
        ├── shared/        # Shared pages
        └── js/
            └── api-client.js  # API wrapper
```

---

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Session không lưu
- Kiểm tra `credentials: 'include'` trong fetch API
- Xóa cookies và thử lại

---

## 👥 Team

Nhóm sinh viên HCMUT - Khoa học và Kỹ thuật Máy tính

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập
# 🎓 MTP - Meeting Tutoring Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)](https://expressjs.com/)

> Hệ thống quản lý buổi học kèm trực tuyến với xác thực tập trung CAS (giả lập HCMUT SSO)

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy dự án](#-chạy-dự-án)
- [API Documentation](#-api-documentation)
- [Phân quyền người dùng](#-phân-quyền-người-dùng)
- [Tài khoản test](#-tài-khoản-test)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Troubleshooting](#-troubleshooting)
- [Đóng góp](#-đóng-góp)
- [License](#-license)

---

## 🌟 Giới thiệu

**MTP (Meeting Tutoring Platform)** là nền tảng quản lý và đăng ký buổi học kèm trực tuyến, được phát triển với kiến trúc phân tán và hệ thống xác thực tập trung CAS.

### ✨ Tính năng chính

- 🔐 **Xác thực tập trung**: Đăng nhập một lần (SSO) qua CAS server giả lập HCMUT
- 👨‍🎓 **Dành cho Student**: Xem, đăng ký và hủy đăng ký buổi học
- 👨‍🏫 **Dành cho Tutor**: Tạo, quản lý và theo dõi buổi học của mình
- 🛡️ **Phân quyền**: Role-Based Access Control (RBAC) với middleware
- 📱 **Responsive**: Giao diện thân thiện trên mọi thiết bị

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   CAS Server    │         │   MTP Backend   │         │  MTP Frontend   │
│   (Port 4000)   │◄────────│   (Port 3001)   │◄────────│   (Port 3002)   │
│                 │         │                 │         │                 │
│ - Login/Logout  │         │ - REST API      │         │ - User Interface│
│ - Ticket Gen    │         │ - Authorization │         │ - Static Files  │
│ - User Auth     │         │ - Session Mgmt  │         │ - API Client    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        ▲                           ▲                           ▲
        │                           │                           │
        └───────────────────────────┴───────────────────────────┘
                        HTTP Communication
```

### Luồng xác thực (CAS Flow)

```
User ──► Frontend ──► Backend ──► CAS Server
                                     │
                                     ▼
                                  Validate
                                     │
                                     ▼
User ◄── Frontend ◄── Backend ◄── Ticket
```

---

## 💻 Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **cookie-session** - Session management
- **axios** - HTTP client
- **xml2js** - XML parser (cho CAS response)
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **HTML5/CSS3** - Markup và styling
- **Vanilla JavaScript** - Logic xử lý
- **Fetch API** - Gọi REST API

### CAS Server (Fake SSO)
- **Express.js** - Web server
- **EJS** - Template engine
- **uuid** - Ticket generation

---

## 📦 Yêu cầu hệ thống

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0
- **Hệ điều hành**: Windows, macOS, Linux
- **Trình duyệt**: Chrome, Firefox, Edge (phiên bản mới nhất)

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/nhunguyen133/mtp-cnpm-251.git
cd mtp-cnpm-251
```

### 2. Cài đặt dependencies

#### Cài đặt cho CAS Server
```bash
cd sso-cas-server
npm install
```

#### Cài đặt cho Backend
```bash
cd ../mtp-backend
npm install
```

#### Cài đặt cho Frontend
```bash
cd ../mtp-frontend
npm install
```

### 3. Kiểm tra cấu hình

Đảm bảo các port sau chưa bị sử dụng:
- **4000** - CAS Server
- **3001** - MTP Backend
- **3002** - MTP Frontend

---

## ▶️ Chạy dự án

### Cách 1: Chạy thủ công (3 terminals)

#### Terminal 1: CAS Server
```bash
cd sso-cas-server
npm start
# hoặc npm run dev (auto-reload với nodemon)
```

#### Terminal 2: MTP Backend
```bash
cd mtp-backend
npm start
# hoặc npm run dev (auto-reload với nodemon)
```

#### Terminal 3: MTP Frontend
```bash
cd mtp-frontend
npm start
```

### Cách 2: Chạy đồng thời (PowerShell - Windows)

```powershell
# Tạo file run-all.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd sso-cas-server; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mtp-backend; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mtp-frontend; npm start"
```

### Truy cập ứng dụng

Mở trình duyệt và truy cập:
```
http://localhost:3002
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

#### 🔓 Login
```http
GET /api/auth/login
```
**Mô tả**: Redirect đến CAS server để đăng nhập

**Response**: Redirect to CAS login page

---

#### 🔓 Callback (sau khi login)
```http
GET /api/auth/callback?ticket=<ticket>
```
**Mô tả**: Xác thực ticket từ CAS và tạo session

**Query Params**:
- `ticket` (string, required) - CAS ticket

**Response Success**:
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": 1,
    "username": "nhu.nguyen@hcmut.edu.vn",
    "name": "Nguyễn Quỳnh Như",
    "role": "student"
  }
}
```

---

#### 🔓 Get Current User
```http
GET /api/auth/me
```
**Mô tả**: Lấy thông tin user hiện tại

**Response**:
```json
{
  "loggedIn": true,
  "user": {
    "id": 1,
    "username": "nhu.nguyen@hcmut.edu.vn",
    "name": "Nguyễn Quỳnh Như",
    "role": "student"
  }
}
```

---

#### 🔓 Logout
```http
GET /api/auth/logout
```
**Mô tả**: Đăng xuất và xóa session (redirect đến CAS logout)

**Response**: Redirect to login page

---

### Student APIs

#### 👨‍🎓 Xem danh sách sessions có thể đăng ký
```http
GET /api/student/sessions
```
**Yêu cầu**: Phải đăng nhập với role `student`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Giải tích 1 - Chương 1",
      "tutorId": 3,
      "tutorName": "Mai Đức Trung",
      "date": "2024-12-01",
      "time": "14:00",
      "duration": 90,
      "capacity": 20,
      "registered": 5,
      "status": "available"
    }
  ]
}
```

---

#### 👨‍🎓 Đăng ký session
```http
POST /api/student/sessions/:sessionId/register
```
**Yêu cầu**: Phải đăng nhập với role `student`

**URL Params**:
- `sessionId` (number) - ID của session

**Response Success**:
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "sessionId": 1,
    "studentId": 1,
    "registeredAt": "2024-11-24T10:30:00.000Z"
  }
}
```

**Response Error** (đã đầy):
```json
{
  "success": false,
  "error": "Session đã đầy!"
}
```

---

#### 👨‍🎓 Hủy đăng ký session
```http
DELETE /api/student/sessions/:sessionId/register
```
**Yêu cầu**: Phải đăng nhập với role `student`

**Response**:
```json
{
  "success": true,
  "message": "Hủy đăng ký thành công!"
}
```

---

#### 👨‍🎓 Xem sessions đã đăng ký
```http
GET /api/student/my-sessions
```
**Yêu cầu**: Phải đăng nhập với role `student`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Giải tích 1 - Chương 1",
      "tutorName": "Mai Đức Trung",
      "date": "2024-12-01",
      "time": "14:00",
      "duration": 90
    }
  ]
}
```

---

### Tutor APIs

#### 👨‍🏫 Xem sessions của mình
```http
GET /api/tutor/sessions
```
**Yêu cầu**: Phải đăng nhập với role `tutor`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Giải tích 1 - Chương 1",
      "date": "2024-12-01",
      "time": "14:00",
      "duration": 90,
      "capacity": 20,
      "registered": 5
    }
  ]
}
```

---

#### 👨‍🏫 Tạo session mới
```http
POST /api/tutor/sessions
```
**Yêu cầu**: Phải đăng nhập với role `tutor`

**Request Body**:
```json
{
  "title": "Giải tích 1 - Chương 1",
  "subject": "Toán",
  "date": "2024-12-01",
  "time": "14:00",
  "duration": 90,
  "capacity": 20,
  "description": "Học về đạo hàm và vi phân"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Tạo session thành công!",
  "data": {
    "id": 5,
    "title": "Giải tích 1 - Chương 1",
    "tutorId": 3
  }
}
```

---

#### 👨‍🏫 Cập nhật session
```http
PUT /api/tutor/sessions/:sessionId
```
**Yêu cầu**: Phải đăng nhập với role `tutor` và là owner của session

**Request Body**:
```json
{
  "title": "Giải tích 1 - Chương 2",
  "time": "15:00",
  "capacity": 25
}
```

**Response**:
```json
{
  "success": true,
  "message": "Cập nhật thành công!"
}
```

---

#### 👨‍🏫 Xóa session
```http
DELETE /api/tutor/sessions/:sessionId
```
**Yêu cầu**: Phải đăng nhập với role `tutor` và là owner của session

**Response**:
```json
{
  "success": true,
  "message": "Xóa session thành công!"
}
```

---

#### 👨‍🏫 Xem danh sách students đã đăng ký
```http
GET /api/tutor/sessions/:sessionId/students
```
**Yêu cầu**: Phải đăng nhập với role `tutor` và là owner của session

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Quỳnh Như",
      "mssv": "1953001",
      "faculty": "Khoa học và Kỹ thuật Máy tính",
      "registeredAt": "2024-11-24T10:30:00.000Z"
    }
  ]
}
```

---

### Common APIs

#### 📋 Xem profile của mình
```http
GET /api/profile
```
**Yêu cầu**: Phải đăng nhập (bất kỳ role nào)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "nhu.nguyen@hcmut.edu.vn",
    "name": "Nguyễn Quỳnh Như",
    "role": "student",
    "mssv": "1953001",
    "faculty": "Khoa học và Kỹ thuật Máy tính"
  }
}
```

---

#### 📋 Xem danh sách tutors
```http
GET /api/tutors
```
**Yêu cầu**: Phải đăng nhập

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Mai Đức Trung",
      "faculty": "Khoa học và Kỹ thuật Máy tính",
      "subjects": ["Toán", "Lập trình"],
      "rating": 4.8
    }
  ]
}
```

---

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Vui lòng đăng nhập!"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Bạn không có quyền truy cập!"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Không tìm thấy resource!"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Dữ liệu không hợp lệ!"
}
```

---

## 🛡️ Phân quyền người dùng

### Roles

| Role | Mô tả | Quyền hạn |
|------|-------|-----------|
| **student** | Sinh viên | Xem và đăng ký sessions |
| **tutor** | Người dạy kèm | Tạo và quản lý sessions |
| **admin** | Quản trị viên | Quản lý toàn bộ hệ thống |

### Middleware Authorization

```javascript
// Yêu cầu đăng nhập
requireAuth

// Yêu cầu role cụ thể
requireRole("student")
requireRole("tutor")

// Yêu cầu ownership (chỉ được thao tác dữ liệu của mình)
requireOwnership

// Kết hợp: Owner hoặc có role cụ thể
requireOwnershipOrRole("admin")
```

---

## 🔑 Tài khoản test

### Students

| Username | Password | Tên | MSSV |
|----------|----------|-----|------|
| nhu.nguyen@hcmut.edu.vn | 123456 | Nguyễn Quỳnh Như | 1953001 |
| mai.tran@hcmut.edu.vn | 123456 | Trần Mai | 1953002 |

### Tutors

| Username | Password | Tên | Faculty |
|----------|----------|-----|---------|
| mdtrung@hcmut.edu.vn | 123456 | Mai Đức Trung | Khoa học và Kỹ thuật Máy tính |

---

## 📁 Cấu trúc thư mục

```
mtp-cnpm-251/
├── sso-cas-server/           # CAS Authentication Server
│   ├── public/
│   │   └── css/
│   │       └── cas.css       # Styles giống HCMUT SSO
│   ├── src/
│   │   ├── casRoutes.js      # CAS protocol routes
│   │   ├── config.js         # Cấu hình
│   │   └── users.js          # Database users cho CAS
│   ├── views/
│   │   └── login.ejs         # Giao diện login CAS
│   ├── server.js             # Entry point
│   └── package.json
│
├── mtp-backend/              # Backend API Server
│   ├── data/
│   │   └── users.js          # Database users với roles
│   ├── middleware/
│   │   └── auth.js           # RBAC middleware
│   ├── server.js             # REST API
│   └── package.json
│
├── mtp-frontend/             # Frontend Application
│   ├── public/
│   │   ├── assets/           # Images, icons
│   │   ├── css/              # Stylesheets
│   │   ├── js/
│   │   │   └── api-client.js # API wrapper
│   │   ├── shared/
│   │   │   └── login.html    # Landing page
│   │   ├── student/
│   │   │   └── dashboard.html
│   │   └── tutor/
│   │       └── dashboard.html
│   ├── server.js             # Static file server
│   └── package.json
│
├── README.md                 # Documentation này
├── AUTHORIZATION-SYSTEM.md   # Chi tiết về RBAC
└── MIGRATION-GUIDE.md        # Hướng dẫn migration
```

---

## 🐛 Troubleshooting

### Lỗi: Port already in use

```bash
# Windows: Tìm và kill process đang dùng port
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Lỗi: Cannot find module

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Invalid ticket

- Kiểm tra CAS server đang chạy trên port 4000
- Xóa cookies trình duyệt và thử lại
- Kiểm tra `service` URL trong backend khớp với callback URL

### Lỗi: CORS

- Kiểm tra frontend đang chạy trên port 3002
- Kiểm tra CORS config trong `mtp-backend/server.js`:
```javascript
cors({
  origin: "http://localhost:3002",
  credentials: true,
})
```

### Session không lưu

- Kiểm tra `credentials: 'include'` trong fetch API
- Kiểm tra cookie settings: `sameSite: 'lax'`

---
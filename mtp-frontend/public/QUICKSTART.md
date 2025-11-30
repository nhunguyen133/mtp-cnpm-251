# QUICKSTART - Bắt Đầu Nhanh
---

## 3 Bước Bắt Đầu

### Bước 1: Setup Git
```bash
git clone <repository-url>
cd M-T-P_demo

# Thành viên 1
git checkout -b feature/student

# Thành viên 2
git checkout -b feature/tutor
```

### Bước 2: Tạo Core Files

1. `js/data.js` - Database hardcode
2. `js/auth.js` - Xác thực  
3. `js/utils.js` - Hàm tiện ích
4. `css/common.css` - Style chung
5. `shared/login.html` - Trang đăng nhập

### Bước 3: Làm Phần Riêng
- **Mem 1:** Code trong `/student/` và `js/student-*.js`
- **Mem 2:** Code trong `/tutor/` và `js/tutor-*.js`

---

## Cách Chạy Dự Án

### Phương án 1: Live Server (VS Code) - KHUYẾN NGHỊ
```bash
# 1. Cài extension Live Server trong VS Code
# 2. Right-click vào file HTML → "Open with Live Server"
# 3. Tự động mở browser tại http://localhost:5500
```

### Phương án 2: Python HTTP Server
```powershell
# Mở terminal trong thư mục dự án
python -m http.server 8000

# Hoặc Python 2
python -m SimpleHTTPServer 8000

# Mở browser: http://localhost:8000
```

### Phương án 3: Node.js HTTP Server
```powershell
# Cài http-server (1 lần duy nhất)
npm install -g http-server

# Chạy server
http-server -p 8000

# Mở browser: http://localhost:8000
```

### Trang Đầu Tiên Để Test:
```
shared/login.html
```

---

## Cấu Trúc Đơn Giản

```
M-T-P_demo/
├── student/
├── tutor/
├── shared/           [Chung - Login]
├── js/               [JavaScript files]
├── css/              [CSS files]
└── README.md
```

---

## Tài Khoản Test

```
Student: student1@hcmut.edu.vn / 123456
Tutor:   tutor1@hcmut.edu.vn / 123456
```

---

## Workflow Nhanh

```bash
# 1. Tạo/sửa file
code student/dashboard.html
code js/student-dashboard.js

# 2. Test trên browser
# Mở file HTML trực tiếp hoặc dùng Live Server

# 3. Commit
git add .
git commit -m "feat: Add student dashboard"
git push origin feature/student

# 4. Pull update từ main (thường xuyên)
git checkout main
git pull origin main
git checkout feature/student
git merge main
```

---

## Test Nhanh

### Cách Test Từng Tính Năng:

#### Test Login:
```javascript
// Mở Console (F12)
console.log(isAuthenticated());
console.log(getCurrentUser());
```

#### Test Student Dashboard:
1. Login: student1@hcmut.edu.vn / 123456
2. Kiểm tra thống kê hiện đúng
3. Console: `console.log(registrations.filter(r => r.studentId === user.id))`

#### Test Tutor Dashboard:
1. Login: tutor1@hcmut.edu.vn / 123456
2. Kiểm tra sessions của tutor
3. Console: `console.log(sessions.filter(s => s.tutorId === user.id))`

---

## ⚠️ Lưu Ý Quan Trọng

1. ✅ **LUÔN** kiểm tra `isAuthenticated()` và role
2. ✅ **LUÔN** test trước khi commit
3. ✅ **LUÔN** pull code mới trước khi bắt đầu làm
4. ❌ **KHÔNG BAO GIỜ** push code lỗi
5. ❌ **KHÔNG BAO GIỜ** commit file không cần thiết

---

### Lỗi Thường Gặp:
- "user is not defined" → Chưa check `isAuthenticated()`
- Data không hiển thị → Chưa dùng `DOMContentLoaded`
- Filter không hoạt động → Sai kiểu dữ liệu (string vs number)
- LocalStorage không lưu → Quên `JSON.stringify()`
---
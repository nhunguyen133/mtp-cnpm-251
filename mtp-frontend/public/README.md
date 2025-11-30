# M-T-P System - Mentee-Tutor-Platform

## Giới Thiệu Dự Án

Hệ thống quản lý chương trình Tutor tại Trường Đại học Bách Khoa - ĐHQG TP.HCM, kết nối sinh viên với tutor để hỗ trợ học tập.

**Phiên bản:** Frontend Only (Hardcoded Data - No Backend)

---

## Phân Công Công Việc

### Mem 1: Phụ trách SINH VIÊN
**Thư mục làm việc:** `/student/`

**Các chức năng cần xây dựng:**
1. ✅ Dashboard - Bảng điều khiển
2. ✅ Profile - Xem thông tin cá nhân
3. ✅ Register Session - Đăng ký lịch học
4. ✅ My Sessions - Xem lịch đã đăng ký
5. ✅ Cancel Session - Hủy lịch học

---

### Mem 2: Phụ trách TUTOR
**Thư mục làm việc:** `/tutor/`

**Các chức năng cần xây dựng:**
1. ✅ Dashboard - Bảng điều khiển
2. ✅ Profile - Xem thông tin cá nhân
3. ✅ Create Session - Tạo buổi học mới
4. ✅ Manage Sessions - Quản lý buổi học
5. ✅ Send Notification - Gửi thông báo

---

## Cấu Trúc Thư Mục

```
M-T-P_demo/
├── README.md                    # File này
├── PROJECT_GUIDE.md            # Hướng dẫn chi tiết từng bước
├── index.html                  # Trang chủ demo
│
├── student/                    # [Thành viên 1]
│   ├── dashboard.html
│   ├── profile.html
│   ├── register.html
│   └── my-sessions.html
│
├── tutor/                      # [Thành viên 2]
│   ├── dashboard.html
│   ├── profile.html
│   ├── create-session.html
│   ├── sessions.html
│   └── notifications.html
│
├── shared/                     # Chung cho cả 2
│   └── login.html
│
├── js/
│   ├── data.js                 # [QUAN TRỌNG] Database hardcode
│   ├── auth.js                 # Xác thực đăng nhập
│   ├── config.js               # Cấu hình chung
│   ├── utils.js                # Hàm tiện ích chung
│   │
│   ├── student-dashboard.js    # [Thành viên 1]
│   ├── student-profile.js      # [Thành viên 1]
│   ├── student-register.js     # [Thành viên 1]
│   ├── student-my-sessions.js  # [Thành viên 1]
│   │
│   ├── tutor-dashboard.js      # [Thành viên 2]
│   ├── tutor-profile.js        # [Thành viên 2]
│   ├── tutor-create-session.js # [Thành viên 2]
│   ├── tutor-sessions.js       # [Thành viên 2]
│   └── tutor-notifications.js  # [Thành viên 2]
│
├── css/
│   ├── common.css              # Style chung
│   ├── student.css             # Style cho sinh viên
│   └── tutor.css               # Style cho tutor
│
└── assets/
    └── images/
```

---

## Hướng Dẫn Bắt Đầu

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd M-T-P_demo
```

### Bước 3: Xem Mockup
Tham khảo các mockup trên drive

### Bước 4: Bắt Đầu Code
- **Mem 1**: Làm việc trong thư mục `/student/` và các file `js/student-*.js`
- **Mem 2**: Làm việc trong thư mục `/tutor/` và các file `js/tutor-*.js`

---

## Dữ Liệu Hardcode (data.js)

File `js/data.js` chứa toàn bộ dữ liệu mẫu:

### Tài Khoản Demo:

**Sinh viên:**
```
Email: student1@hcmut.edu.vn
Password: 123456
Tên: Nguyễn Văn A

Email: student2@hcmut.edu.vn
Password: 123456
Tên: Trần Thị B
```

**Tutor:**
```
Email: tutor1@hcmut.edu.vn
Password: 123456
Tên: TS. Lê Văn C
Chuyên môn: Lập trình C++, Cấu trúc dữ liệu

Email: tutor2@hcmut.edu.vn
Password: 123456
Tên: ThS. Phạm Thị D
Chuyên môn: Cơ sở dữ liệu, Web Development

Email: tutor3@hcmut.edu.vn
Password: 123456
Tên: ThS. Hoàng Văn E
Chuyên môn: Machine Learning, Python
```

### Cấu trúc dữ liệu:
- `users[]` - Danh sách người dùng
- `sessions[]` - Danh sách buổi học
- `registeredSessions[]` - Lịch đã đăng ký
- `notifications[]` - Thông báo
- `evaluations[]` - Đánh giá
- `documents[]` - Tài liệu

---

## Giao Diện (UI)

### Màu Sắc Chủ Đạo:
- app.moqups

### Font:
- Font chính: `'Roboto', sans-serif`

---

## Quy Tắc Code

### 1. Đặt Tên File:
- HTML: `kebab-case.html` (vd: `my-sessions.html`)
- JavaScript: `kebab-case.js` (vd: `student-dashboard.js`)
- CSS: `kebab-case.css` (vd: `common.css`)

### 2. Đặt Tên Biến:
- JavaScript: `camelCase` (vd: `currentUser`, `sessionsList`)
- CSS class: `kebab-case` (vd: `.btn-primary`, `.session-card`)
- ID: `camelCase` (vd: `#userProfile`, `#sessionsList`)

### 3. Cấu Trúc HTML:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiêu đề trang</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/student.css">
</head>
<body>
    <!-- Nội dung -->
    
    <!-- JavaScript - QUAN TRỌNG: Thứ tự này -->
    <script src="../js/data.js"></script>
    <script src="../js/config.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/[page-specific].js"></script>
</body>
</html>
```

### 4. Cấu Trúc JavaScript:
```javascript
// Kiểm tra đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = '../shared/login.html';
        return;
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.role !== 'student') { // hoặc 'tutor'
        alert('Bạn không có quyền truy cập trang này');
        window.location.href = '../shared/login.html';
        return;
    }
    
    // Load dữ liệu
    loadData();
});

function loadData() {
    // Code của bạn
}
```

---

## Các Hàm Tiện Ích Có Sẵn (utils.js)

```javascript
// Xác thực
isAuthenticated()           // Kiểm tra đã đăng nhập chưa
getCurrentUser()            // Lấy thông tin user hiện tại
logout()                    // Đăng xuất

// Format
formatDate(dateString)      // Format ngày: 21/11/2025
formatTime(timeString)      // Format giờ: 14:30
formatDateTime(dateString)  // Format ngày giờ: 21/11/2025 14:30

// Validation
isValidEmail(email)         // Kiểm tra email hợp lệ
isValidPhone(phone)         // Kiểm tra SĐT hợp lệ

// UI
showLoading()               // Hiện loading
hideLoading()               // Ẩn loading
showToast(message, type)    // Hiện thông báo toast
```

---

## Debug & Testing

### Mở Console để Debug:
```
F12 (Chrome/Edge/Firefox)
Cmd+Option+I (Mac)
```

### Test Cases Cơ Bản:

#### Test Login:
```javascript
// Console
console.log(localStorage.getItem('currentUser'));
console.log(isAuthenticated());
console.log(getCurrentUser());
```

#### Test Data Loading:
```javascript
// Console
console.log('Users:', users);
console.log('Sessions:', sessions);
console.log('Registrations:', registrations);
```

#### Test Student Functions:
```javascript
// Kiểm tra sessions của student
const user = getCurrentUser();
const myRegs = registrations.filter(r => r.studentId === user.id);
console.log('My registrations:', myRegs);
```

#### Test Tutor Functions:
```javascript
// Kiểm tra sessions của tutor
const user = getCurrentUser();
const mySessions = sessions.filter(s => s.tutorId === user.id);
console.log('My sessions:', mySessions);
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Không được sửa file `data.js`** khi đang phát triển (trừ khi cần thêm dữ liệu mới)
2. **Luôn pull code mới nhất** từ GitHub trước khi bắt đầu làm việc
3. **Commit thường xuyên** với message rõ ràng
4. **Không commit file không cần thiết** (node_modules, .DS_Store, etc.)
5. **Test kỹ trước khi push** code lên GitHub

---
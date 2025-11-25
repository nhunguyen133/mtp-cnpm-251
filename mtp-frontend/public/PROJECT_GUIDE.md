# PROJECT GUIDE - Hướng Dẫn Chi Tiết Từng Bước

## Mục Đích

Tài liệu này hướng dẫn chi tiết cách xây dựng từng chức năng của hệ thống M-T-P.

---

## PHẦN 1: SETUP BAN ĐẦU

### 1.1. Tạo File data.js - Database Hardcode

File này chứa TẤT CẢ dữ liệu của hệ thống.

**Vị trí:** `js/data.js`

```javascript
// ================== USERS ==================
const users = [
    {
        id: 1,
        username: 'student1@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Nguyễn Văn A',
        mssv: '2112345',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'student1@hcmut.edu.vn',
        phone: '0901234567'
    },
    // ... Thêm users khác
];

// ================== SESSIONS ==================
const sessions = [
    {
        id: 1,
        tutorId: 3,
        tutorName: 'TS. Lê Văn C',
        title: 'Lập trình hướng đối tượng cơ bản',
        subject: 'Lập trình C++',
        description: 'Học về class, object, inheritance',
        date: '2025-11-24',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-101',
        type: 'offline', // hoặc 'online'
        maxStudents: 10,
        currentStudents: 0,
        status: 'open',
        students: [] // Array of student IDs
    },
    // ... Thêm sessions khác
];

// ================== REGISTERED SESSIONS ==================
const registeredSessions = [
    {
        id: 1,
        sessionId: 1,
        studentId: 1,
        status: 'confirmed', // hoặc 'pending', 'cancelled'
        registeredAt: '2025-11-20T10:30:00'
    },
    // ... Thêm registrations khác
];

// ================== NOTIFICATIONS ==================
const notifications = [
    {
        id: 1,
        userId: 1,
        title: 'Nhắc nhở buổi học',
        message: 'Buổi học sẽ bắt đầu vào 14:00',
        type: 'reminder', // reminder, success, info, warning, error
        isRead: false,
        createdAt: '2025-11-21T08:00:00'
    },
    // ... Thêm notifications khác
];

// ================== EVALUATIONS ==================
const evaluations = [
    {
        id: 1,
        sessionId: 1,
        studentId: 1,
        tutorId: 3,
        rating: 5, // 1-5
        comment: 'Tutor giảng dạy rất tốt',
        createdAt: '2025-11-17T18:00:00'
    },
    // ... Thêm evaluations khác
];
```

### 1.2. Tạo File auth.js - Xác Thực

**Vị trí:** `js/auth.js`

```javascript
// Lưu thông tin đăng nhập vào localStorage
function saveAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Kiểm tra đã đăng nhập chưa
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Đăng xuất
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../shared/login.html';
}

// Đăng nhập
function login(username, password) {
    // Tìm user trong data.js
    const user = users.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        const token = 'token_' + user.id + '_' + Date.now();
        saveAuthData(token, user);
        return { success: true, user: user };
    }
    
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' };
}
```

### 1.3. Tạo File utils.js - Hàm Tiện Ích

**Vị trí:** `js/utils.js`

```javascript
// Format date: 21/11/2025
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format time: 14:30
function formatTime(timeString) {
    return timeString;
}

// Format datetime: 21/11/2025 14:30
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    // type: success, error, info, warning
    alert(message); // Có thể thay bằng toast library
}

// Show loading
function showLoading() {
    document.getElementById('loading')?.classList.remove('hidden');
}

// Hide loading
function hideLoading() {
    document.getElementById('loading')?.classList.add('hidden');
}
```

### 1.4. Tạo File common.css - Style Chung

**Vị trí:** `css/common.css`

```css
/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f5f5;
    color: #333;
}

/* Container */
.container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 20px;
}
```

---

## PHẦN 2: SINH VIÊN

### 2.1. Dashboard Sinh Viên

**File:** `student/dashboard.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Sinh viên</title>
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/student.css">
</head>
<body>
    <div class="container">
        <h1>Bảng Điều Khiển</h1>
        
        <!-- Stats -->
        <div class="stats-grid" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="totalSessions">0</div>
                <div class="stat-label">Buổi học đã đăng ký</div>
            </div>
            <!-- More stats... -->
        </div>
        
        <!-- Upcoming sessions -->
        <div class="section">
            <h2>Buổi học sắp tới</h2>
            <div id="upcomingSessions"></div>
        </div>
        
        <!-- Notifications -->
        <div class="section">
            <h2>Thông báo</h2>
            <div id="notifications"></div>
        </div>
    </div>
    
    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/student-dashboard.js"></script>
</body>
</html>
```

**File:** `js/student-dashboard.js`

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    if (!isAuthenticated()) {
        window.location.href = '../shared/login.html';
        return;
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.role !== 'student') {
        alert('Bạn không có quyền truy cập');
        window.location.href = '../shared/login.html';
        return;
    }
    
    loadDashboard();
});

function loadDashboard() {
    const currentUser = getCurrentUser();
    
    // 1. Load Stats
    loadStats(currentUser);
    
    // 2. Load Upcoming Sessions
    loadUpcomingSessions(currentUser);
    
    // 3. Load Notifications
    loadNotifications(currentUser);
}

function loadStats(user) {
    // Tính toán thống kê
    const myRegistrations = registeredSessions.filter(
        r => r.studentId === user.id
    );
    
    const totalSessions = myRegistrations.length;
    const upcoming = myRegistrations.filter(r => {
        const session = sessions.find(s => s.id === r.sessionId);
        return session && new Date(session.date) >= new Date();
    }).length;
    
    // Hiển thị
    document.getElementById('totalSessions').textContent = totalSessions;
    // ... Cập nhật các stats khác
}

function loadUpcomingSessions(user) {
    const container = document.getElementById('upcomingSessions');
    
    // Lấy các session sắp tới của student
    const myRegistrations = registeredSessions.filter(
        r => r.studentId === user.id
    );
    
    const upcomingSessions = myRegistrations
        .map(r => sessions.find(s => s.id === r.sessionId))
        .filter(s => s && new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Render
    if (upcomingSessions.length === 0) {
        container.innerHTML = '<p>Chưa có buổi học sắp tới</p>';
        return;
    }
    
    container.innerHTML = upcomingSessions.map(session => `
        <div class="session-card">
            <h3>${session.title}</h3>
            <p><strong>Tutor:</strong> ${session.tutorName}</p>
            <p><strong>Thời gian:</strong> ${formatDate(session.date)} ${session.startTime}</p>
            <p><strong>Địa điểm:</strong> ${session.location}</p>
        </div>
    `).join('');
}

function loadNotifications(user) {
    const container = document.getElementById('notifications');
    
    // Lấy thông báo của user
    const userNotifications = notifications
        .filter(n => n.userId === user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    // Render
    container.innerHTML = userNotifications.map(notif => `
        <div class="notification-item ${notif.isRead ? 'read' : 'unread'}">
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
            <small>${formatDateTime(notif.createdAt)}</small>
        </div>
    `).join('');
}
```

### 2.2. Đăng Ký Lịch Học

**File:** `student/register.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng ký lịch</title>
    <link rel="stylesheet" href="../css/common.css">
</head>
<body>
    <div class="container">
        <h1>Đăng Ký Lịch Học</h1>
        
        <!-- Search form -->
        <div class="search-section">
            <select id="subjectFilter">
                <option value="">Tất cả môn học</option>
                <option value="Lập trình C++">Lập trình C++</option>
                <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                <!-- More options... -->
            </select>
            <button onclick="searchTutors()">Tìm kiếm</button>
        </div>
        
        <!-- Tutors list -->
        <div id="tutorsList"></div>
    </div>
    
    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/student-register.js"></script>
</body>
</html>
```

**File:** `js/student-register.js`

```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = '../shared/login.html';
        return;
    }
    
    loadTutors();
});

function searchTutors() {
    const subject = document.getElementById('subjectFilter').value;
    loadTutors(subject);
}

function loadTutors(subjectFilter = '') {
    const container = document.getElementById('tutorsList');
    
    // Lấy danh sách tutors
    let tutorList = users.filter(u => u.role === 'tutor');
    
    // Filter by subject
    if (subjectFilter) {
        tutorList = tutorList.filter(t => 
            t.specialization && t.specialization.includes(subjectFilter)
        );
    }
    
    // Render
    container.innerHTML = tutorList.map(tutor => {
        const tutorSessions = sessions.filter(
            s => s.tutorId === tutor.id && s.status === 'open'
        );
        
        return `
            <div class="tutor-card">
                <h3>${tutor.name}</h3>
                <p>${tutor.bio || ''}</p>
                <p><strong>Chuyên môn:</strong> ${tutor.specialization?.join(', ')}</p>
                <button onclick="viewSessions(${tutor.id})">
                    Xem lịch (${tutorSessions.length} buổi)
                </button>
            </div>
        `;
    }).join('');
}

function viewSessions(tutorId) {
    const tutor = users.find(u => u.id === tutorId);
    const tutorSessions = sessions.filter(
        s => s.tutorId === tutorId && s.status === 'open'
    );
    
    // Hiển thị modal với danh sách sessions
    // TODO: Implement modal
    console.log('Sessions of', tutor.name, tutorSessions);
}

function registerSession(sessionId) {
    const currentUser = getCurrentUser();
    const session = sessions.find(s => s.id === sessionId);
    
    // Kiểm tra đã đăng ký chưa
    const alreadyRegistered = registeredSessions.some(
        r => r.sessionId === sessionId && r.studentId === currentUser.id
    );
    
    if (alreadyRegistered) {
        alert('Bạn đã đăng ký buổi học này rồi!');
        return;
    }
    
    // Kiểm tra còn chỗ không
    if (session.currentStudents >= session.maxStudents) {
        alert('Buổi học đã đủ số lượng!');
        return;
    }
    
    // Đăng ký
    registeredSessions.push({
        id: registeredSessions.length + 1,
        sessionId: sessionId,
        studentId: currentUser.id,
        status: 'confirmed',
        registeredAt: new Date().toISOString()
    });
    
    // Cập nhật số lượng
    session.currentStudents++;
    session.students.push(currentUser.id);
    
    alert('✓ Đăng ký thành công!');
    loadTutors(); // Reload
}
```

### 2.3. Xem Lịch Đã Đăng Ký

*(Tương tự, cung cấp template và logic)*

### 2.4. Hủy Lịch

*(Tương tự, cung cấp template và logic)*

### 2.5. Đánh Giá Buổi Học

*(Tương tự, cung cấp template và logic)*

---

## 👨‍🏫 PHẦN 3: TUTOR (Thành Viên 2)

### 3.1. Dashboard Tutor

**File:** `tutor/dashboard.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Tutor</title>
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/tutor.css">
</head>
<body>
    <div class="container">
        <h1>Bảng Điều Khiển Tutor</h1>
        
        <!-- Stats -->
        <div class="stats-grid" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="totalSessions">0</div>
                <div class="stat-label">Tổng buổi học</div>
            </div>
            <!-- More stats... -->
        </div>
        
        <!-- My sessions -->
        <div class="section">
            <h2>Buổi học của tôi</h2>
            <div id="mySessions"></div>
        </div>
    </div>
    
    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/tutor-dashboard.js"></script>
</body>
</html>
```

**File:** `js/tutor-dashboard.js`

```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = '../shared/login.html';
        return;
    }
    
    const currentUser = getCurrentUser();
    if (currentUser.role !== 'tutor') {
        alert('Bạn không có quyền truy cập');
        window.location.href = '../shared/login.html';
        return;
    }
    
    loadDashboard();
});

function loadDashboard() {
    const currentUser = getCurrentUser();
    
    // 1. Load Stats
    loadStats(currentUser);
    
    // 2. Load My Sessions
    loadMySessions(currentUser);
}

function loadStats(user) {
    // Tính toán thống kê
    const mySessions = sessions.filter(s => s.tutorId === user.id);
    const totalSessions = mySessions.length;
    const activeSessions = mySessions.filter(
        s => s.status === 'open' && new Date(s.date) >= new Date()
    ).length;
    
    let totalStudents = 0;
    mySessions.forEach(s => {
        totalStudents += s.currentStudents;
    });
    
    // Calculate average rating
    const myEvaluations = evaluations.filter(e => e.tutorId === user.id);
    const avgRating = myEvaluations.length > 0
        ? (myEvaluations.reduce((sum, e) => sum + e.rating, 0) / myEvaluations.length).toFixed(1)
        : 'N/A';
    
    // Display
    document.getElementById('totalSessions').textContent = totalSessions;
    // ... Update other stats
}

function loadMySessions(user) {
    const container = document.getElementById('mySessions');
    
    // Get tutor's sessions
    const mySessions = sessions
        .filter(s => s.tutorId === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render
    container.innerHTML = mySessions.map(session => `
        <div class="session-card">
            <h3>${session.title}</h3>
            <p><strong>Môn:</strong> ${session.subject}</p>
            <p><strong>Thời gian:</strong> ${formatDate(session.date)} ${session.startTime}</p>
            <p><strong>Số SV:</strong> ${session.currentStudents}/${session.maxStudents}</p>
            <button onclick="manageSession(${session.id})">Quản lý</button>
        </div>
    `).join('');
}
```

### 3.2. Tạo Buổi Học Mới

*(Tương tự, cung cấp template và logic)*

### 3.3. Quản Lý Buổi Học

*(Tương tự, cung cấp template và logic)*

### 3.4. Gửi Thông Báo

*(Tương tự, cung cấp template và logic)*

---

## PHẦN 4: TÍCH HỢP

### 4.1. Đăng Nhập Chung

**File:** `shared/login.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng nhập - M-T-P</title>
    <link rel="stylesheet" href="../css/common.css">
</head>
<body>
    <div class="login-container">
        <h1>Đăng Nhập</h1>
        <form id="loginForm">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="username" required>
            </div>
            <div class="form-group">
                <label>Mật khẩu</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Đăng nhập</button>
        </form>
        
        <div class="demo-accounts">
            <h3>Tài khoản demo:</h3>
            <p>student1@hcmut.edu.vn / 123456</p>
            <p>tutor1@hcmut.edu.vn / 123456</p>
        </div>
    </div>
    
    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = login(username, password);
            
            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'student') {
                    window.location.href = '../student/dashboard.html';
                } else if (result.user.role === 'tutor') {
                    window.location.href = '../tutor/dashboard.html';
                }
            } else {
                alert(result.message);
            }
        });
    </script>
</body>
</html>
```

---
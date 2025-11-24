# 📖 API Reference - MTP Backend

## Base Information

- **Base URL**: `http://localhost:3001/api`
- **Authentication**: Session-based (cookie)
- **Content-Type**: `application/json`
- **CORS**: Enabled for `http://localhost:3002`

---

## 🔐 Authentication Endpoints

### Login Flow

```
User → GET /api/auth/login → CAS Server → User enters credentials
  ↓
CAS validates → Generates ticket → Redirects to /api/auth/callback?ticket=xxx
  ↓
Backend validates ticket → Creates session → Redirects to frontend
```

---

### `GET /api/auth/login`

Khởi tạo quá trình đăng nhập CAS.

**Request**:
```http
GET /api/auth/login
```

**Response**: HTTP 302 Redirect
```
Location: http://localhost:4000/cas/login?service=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fcallback
```

**Example (JavaScript)**:
```javascript
// Redirect user to login
window.location.href = 'http://localhost:3001/api/auth/login';
```

---

### `GET /api/auth/callback`

Xử lý callback từ CAS server sau khi login thành công.

**Query Parameters**:
- `ticket` (string, required) - CAS service ticket

**Request**:
```http
GET /api/auth/callback?ticket=ST-1234-abcd
```

**Response Success** (200):
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": 1,
    "username": "nhu.nguyen@hcmut.edu.vn",
    "name": "Nguyễn Quỳnh Như",
    "role": "student",
    "mssv": "1953001",
    "faculty": "Khoa học và Kỹ thuật Máy tính"
  }
}
```

**Response Error** (401):
```json
{
  "success": false,
  "error": "Ticket không hợp lệ"
}
```

**Set-Cookie**:
```
mtp_session=eyJwYXNzcG9ydCI6eyJ1c2VyIjp...
```

---

### `GET /api/auth/me`

Lấy thông tin user hiện đang đăng nhập.

**Headers**:
```
Cookie: mtp_session=...
```

**Request**:
```http
GET /api/auth/me
```

**Response - Logged In** (200):
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

**Response - Not Logged In** (200):
```json
{
  "loggedIn": false
}
```

**Example (JavaScript)**:
```javascript
const response = await fetch('http://localhost:3001/api/auth/me', {
  credentials: 'include' // Important: send cookies
});
const data = await response.json();
if (data.loggedIn) {
  console.log('User:', data.user);
}
```

---

### `GET /api/auth/logout`

Đăng xuất và xóa session.

**Request**:
```http
GET /api/auth/logout
```

**Response**: HTTP 302 Redirect
```
Location: http://localhost:4000/cas/logout?service=http://localhost:3002/shared/login.html
```

**Example**:
```javascript
window.location.href = 'http://localhost:3001/api/auth/logout';
```

---

## 👨‍🎓 Student Endpoints

### `GET /api/student/sessions`

Lấy danh sách tất cả sessions có thể đăng ký.

**Authorization**: `requireRole("student")`

**Request**:
```http
GET /api/student/sessions
Cookie: mtp_session=...
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Giải tích 1 - Chương 1: Giới hạn",
      "subject": "Toán",
      "tutorId": 3,
      "tutorName": "Mai Đức Trung",
      "date": "2024-12-01",
      "time": "14:00",
      "duration": 90,
      "capacity": 20,
      "registered": 5,
      "status": "available",
      "description": "Học về giới hạn của hàm số"
    },
    {
      "id": 2,
      "title": "C++ Cơ bản",
      "subject": "Lập trình",
      "tutorId": 3,
      "tutorName": "Mai Đức Trung",
      "date": "2024-12-02",
      "time": "15:30",
      "duration": 120,
      "capacity": 15,
      "registered": 15,
      "status": "full",
      "description": "Cú pháp và cấu trúc dữ liệu"
    }
  ]
}
```

**Status values**:
- `available` - Còn chỗ trống
- `full` - Đã đầy
- `cancelled` - Đã hủy

---

### `POST /api/student/sessions/:sessionId/register`

Đăng ký tham gia một session.

**Authorization**: `requireRole("student")`

**URL Parameters**:
- `sessionId` (number) - ID của session

**Request**:
```http
POST /api/student/sessions/1/register
Cookie: mtp_session=...
```

**Response Success** (200):
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

**Response Error - Already Full** (400):
```json
{
  "success": false,
  "error": "Session đã đầy!"
}
```

**Response Error - Already Registered** (400):
```json
{
  "success": false,
  "error": "Bạn đã đăng ký session này rồi!"
}
```

**Example**:
```javascript
const sessionId = 1;
const response = await fetch(`http://localhost:3001/api/student/sessions/${sessionId}/register`, {
  method: 'POST',
  credentials: 'include'
});
const data = await response.json();
```

---

### `DELETE /api/student/sessions/:sessionId/register`

Hủy đăng ký session.

**Authorization**: `requireRole("student")`

**Request**:
```http
DELETE /api/student/sessions/1/register
Cookie: mtp_session=...
```

**Response** (200):
```json
{
  "success": true,
  "message": "Hủy đăng ký thành công!"
}
```

**Response Error** (404):
```json
{
  "success": false,
  "error": "Bạn chưa đăng ký session này!"
}
```

---

### `GET /api/student/my-sessions`

Lấy danh sách sessions mà student đã đăng ký.

**Authorization**: `requireRole("student")`

**Request**:
```http
GET /api/student/my-sessions
Cookie: mtp_session=...
```

**Response** (200):
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
      "duration": 90,
      "registeredAt": "2024-11-24T10:30:00.000Z",
      "status": "confirmed"
    }
  ]
}
```

---

## 👨‍🏫 Tutor Endpoints

### `GET /api/tutor/sessions`

Lấy danh sách sessions của tutor.

**Authorization**: `requireRole("tutor")`

**Request**:
```http
GET /api/tutor/sessions
Cookie: mtp_session=...
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Giải tích 1 - Chương 1",
      "subject": "Toán",
      "date": "2024-12-01",
      "time": "14:00",
      "duration": 90,
      "capacity": 20,
      "registered": 5,
      "status": "active"
    }
  ]
}
```

---

### `POST /api/tutor/sessions`

Tạo session mới.

**Authorization**: `requireRole("tutor")`

**Request**:
```http
POST /api/tutor/sessions
Content-Type: application/json
Cookie: mtp_session=...

{
  "title": "Giải tích 1 - Chương 1",
  "subject": "Toán",
  "date": "2024-12-01",
  "time": "14:00",
  "duration": 90,
  "capacity": 20,
  "description": "Học về giới hạn và liên tục"
}
```

**Required Fields**:
- `title` (string) - Tiêu đề session
- `subject` (string) - Môn học
- `date` (string, YYYY-MM-DD) - Ngày
- `time` (string, HH:MM) - Giờ
- `duration` (number) - Thời lượng (phút)
- `capacity` (number) - Sức chứa

**Optional Fields**:
- `description` (string) - Mô tả chi tiết

**Response** (201):
```json
{
  "success": true,
  "message": "Tạo session thành công!",
  "data": {
    "id": 5,
    "title": "Giải tích 1 - Chương 1",
    "tutorId": 3,
    "createdAt": "2024-11-24T10:30:00.000Z"
  }
}
```

**Example**:
```javascript
const sessionData = {
  title: "Giải tích 1 - Chương 1",
  subject: "Toán",
  date: "2024-12-01",
  time: "14:00",
  duration: 90,
  capacity: 20,
  description: "Học về giới hạn"
};

const response = await fetch('http://localhost:3001/api/tutor/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(sessionData)
});
```

---

### `PUT /api/tutor/sessions/:sessionId`

Cập nhật thông tin session.

**Authorization**: `requireRole("tutor")` + owner check

**Request**:
```http
PUT /api/tutor/sessions/1
Content-Type: application/json
Cookie: mtp_session=...

{
  "title": "Giải tích 1 - Chương 2",
  "time": "15:00",
  "capacity": 25
}
```

**Updatable Fields**: title, subject, date, time, duration, capacity, description

**Response** (200):
```json
{
  "success": true,
  "message": "Cập nhật session thành công!"
}
```

---

### `DELETE /api/tutor/sessions/:sessionId`

Xóa session.

**Authorization**: `requireRole("tutor")` + owner check

**Request**:
```http
DELETE /api/tutor/sessions/1
Cookie: mtp_session=...
```

**Response** (200):
```json
{
  "success": true,
  "message": "Xóa session thành công!"
}
```

**Response Error** (400):
```json
{
  "success": false,
  "error": "Không thể xóa session đã có students đăng ký!"
}
```

---

### `GET /api/tutor/sessions/:sessionId/students`

Xem danh sách students đã đăng ký session.

**Authorization**: `requireRole("tutor")` + owner check

**Request**:
```http
GET /api/tutor/sessions/1/students
Cookie: mtp_session=...
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Quỳnh Như",
      "username": "nhu.nguyen@hcmut.edu.vn",
      "mssv": "1953001",
      "faculty": "Khoa học và Kỹ thuật Máy tính",
      "registeredAt": "2024-11-24T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Nguyễn Trần Phương Mai",
      "username": "mai.tran@hcmut.edu.vn",
      "mssv": "1953002",
      "faculty": "Khoa học Ứng dụng",
      "registeredAt": "2024-11-24T11:00:00.000Z"
    }
  ]
}
```

---

## 🔓 Common Endpoints

### `GET /api/profile`

Xem profile của chính mình.

**Authorization**: `requireAuth`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "nhu.nguyen@hcmut.edu.vn",
    "name": "Nguyễn Quỳnh Như",
    "role": "student",
    "mssv": "1953001",
    "faculty": "Khoa học và Kỹ thuật Máy tính",
    "email": "nhu.nguyen@hcmut.edu.vn"
  }
}
```

---

### `GET /api/tutors`

Xem danh sách tất cả tutors.

**Authorization**: `requireAuth`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Mai Đức Trung",
      "faculty": "Khoa học và Kỹ thuật Máy tính",
      "subjects": ["Toán", "Lập trình"],
      "rating": 4.8,
      "totalSessions": 15
    }
  ]
}
```

---

### `GET /api/tutors/:id`

Xem chi tiết một tutor.

**Authorization**: `requireAuth`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Mai Đức Trung",
    "username": "mdtrung@hcmut.edu.vn",
    "faculty": "Khoa học và Kỹ thuật Máy tính",
    "subjects": ["Toán", "Lập trình"],
    "bio": "Giảng viên Toán - Lập trình",
    "rating": 4.8,
    "totalSessions": 15,
    "totalStudents": 120
  }
}
```

---

## ⚠️ Error Codes

| Status Code | Meaning | Example |
|------------|---------|---------|
| 200 | Success | Request thành công |
| 201 | Created | Tạo resource mới thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy resource |
| 500 | Internal Server Error | Lỗi server |

---

## 📌 Important Notes

### Cookies & CORS

Khi gọi API từ frontend, **BẮT BUỘC** phải set:

```javascript
fetch(url, {
  credentials: 'include' // Send cookies
})
```

### Session Lifetime

- Session tồn tại: **24 giờ**
- Sau khi logout, session bị xóa ngay lập tức

### Rate Limiting

Hiện tại chưa có rate limiting. Sẽ được thêm trong phiên bản sau.

---

## 🧪 Testing với cURL

### Login flow
```bash
# Step 1: Get redirect URL
curl -i http://localhost:3001/api/auth/login

# Step 2: Login via CAS (manual in browser)
# Step 3: Get session info
curl -b cookies.txt http://localhost:3001/api/auth/me
```

### Get sessions (as student)
```bash
curl -b cookies.txt http://localhost:3001/api/student/sessions
```

### Create session (as tutor)
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test","subject":"Toán","date":"2024-12-01","time":"14:00","duration":90,"capacity":20}' \
  http://localhost:3001/api/tutor/sessions
```

---
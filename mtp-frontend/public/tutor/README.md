# PHẦN TUTOR

## Các file cần tạo:

### HTML Files:
- [ ] `dashboard.html` - Bảng điều khiển
- [ ] `profile.html` - Xem thông tin cá nhân
- [ ] `create-session.html` - Tạo buổi học mới
- [ ] `sessions.html` - Quản lý buổi học
- [ ] `notifications.html` - Gửi thông báo

### JavaScript Files (trong `/js/`):
- [ ] `tutor-dashboard.js` - Logic cho dashboard
- [ ] `tutor-profile.js` - Logic cho profile
- [ ] `tutor-create-session.js` - Logic tạo buổi học
- [ ] `tutor-sessions.js` - Logic quản lý buổi học
- [ ] `tutor-notifications.js` - Logic gửi thông báo

## Chức năng cần hoàn thành:

### 1. Dashboard (Ưu tiên cao)
- [ ] Hiển thị thống kê: Tổng buổi học, đang mở, tổng sinh viên, rating TB
- [ ] Hiển thị danh sách buổi học của tutor
- [ ] Hiển thị thông báo/yêu cầu mới
- [ ] Quick actions: Tạo buổi học, Gửi thông báo

### 2. Profile
- [ ] Hiển thị thông tin tutor từ data.js
- [ ] Hiển thị chuyên môn
- [ ] Hiển thị rating và số sinh viên đã dạy
- [ ] Hiển thị đánh giá từ sinh viên

### 3. Create Session (Ưu tiên cao)
- [ ] Form tạo buổi học mới
  - Tiêu đề
  - Môn học
  - Mô tả
  - Ngày, giờ bắt đầu, giờ kết thúc
  - Loại: Online/Offline
  - Địa điểm hoặc link meeting
  - Số lượng sinh viên tối đa
- [ ] Validate dữ liệu
- [ ] Thêm session mới vào sessions[]
- [ ] Thông báo thành công

### 4. Manage Sessions (Ưu tiên cao)
- [ ] Hiển thị tất cả buổi học của tutor
- [ ] Phân loại: Đang mở / Đã qua
- [ ] Xem danh sách sinh viên đã đăng ký
- [ ] Đóng lớp học
- [ ] Xem đánh giá của sinh viên
- [ ] Xem chi tiết từng buổi học

### 5. View Students
- [ ] Hiển thị danh sách sinh viên trong từng lớp
- [ ] Thông tin: MSSV, Tên, Email, Trạng thái
- [ ] Export danh sách (optional)

### 6. Send Notification
- [ ] Chọn lớp học muốn gửi thông báo
- [ ] Nhập tiêu đề và nội dung
- [ ] Gửi thông báo đến tất cả sinh viên trong lớp
- [ ] Thêm notification vào notifications[]

### 7. View Evaluations
- [ ] Xem tất cả đánh giá từ sinh viên
- [ ] Filter theo buổi học
- [ ] Hiển thị rating trung bình
- [ ] Hiển thị nhận xét chi tiết

## Tham khảo:

- Xem mockup trong thư mục UI trên drive chung
- Dữ liệu mẫu trong `js/data.js`

## ⚠️ Lưu ý:

1. Luôn kiểm tra `isAuthenticated()` và role === 'tutor'
2. Dùng `getCurrentUser()` để lấy thông tin user hiện tại
3. Khi tạo session mới, nhớ set tutorId = currentUser.id
4. Validate thời gian: Không được tạo buổi học trong quá khứ
5. Test kỹ trước khi commit

## Tips:

### Tạo session mới:
```javascript
const newSession = {
    id: sessions.length + 1,
    tutorId: currentUser.id,
    tutorName: currentUser.name,
    title: formData.title,
    subject: formData.subject,
    // ... other fields
    currentStudents: 0,
    status: 'open',
    students: []
};

sessions.push(newSession);
```

### Gửi thông báo:
```javascript
// Lấy tất cả sinh viên trong lớp
const sessionStudents = registeredSessions
    .filter(r => r.sessionId === sessionId)
    .map(r => r.studentId);

// Tạo notification cho từng sinh viên
sessionStudents.forEach(studentId => {
    notifications.push({
        id: notifications.length + 1,
        userId: studentId,
        title: title,
        message: message,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
    });
});
```
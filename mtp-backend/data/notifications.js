// ================== NOTIFICATIONS ==================
// Thông báo cho users (ở đây demo chủ yếu cho sinh viên)
// Tham chiếu user bằng mssv (không dùng userId riêng)

const notifications = [
    {
        id: 1,
        mssv: '2313384',
        title: 'Nhắc nhở buổi học',
        message: 'Buổi học "Công nghệ phần mềm - L01" sẽ bắt đầu lúc 13:00 ngày 18/10.',
        type: 'reminder',
        isRead: false,
        createdAt: '2025-10-18T08:00:00'
    },
    {
        id: 2,
        mssv: '2313384',
        title: 'Đăng ký thành công',
        message: 'Bạn đã đăng ký thành công buổi "Lập trình C++ - L01".',
        type: 'success',
        isRead: false,
        createdAt: '2025-11-20T11:00:00'
    },
    {
        id: 3,
        mssv: '2313384',
        title: 'Nhắc nhở đánh giá',
        message: 'Vui lòng đánh giá buổi "Lập trình Java - L01".',
        type: 'info',
        isRead: true,
        createdAt: '2025-11-26T16:30:00'
    },
    {
        id: 4,
        mssv: '2312535',
        title: 'Nhắc nhở buổi học',
        message: 'Buổi học "Lập trình C++ - L02" sẽ bắt đầu lúc 14:00 ngày 26/11.',
        type: 'reminder',
        isRead: false,
        createdAt: '2025-11-25T18:00:00'
    }
];

module.exports = notifications;

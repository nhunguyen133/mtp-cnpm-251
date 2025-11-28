// ================== TUTOR AVAILABILITY ==================
// Lịch rảnh/có thể dạy của các tutors
// Tham chiếu tutor bằng mscb

const tutorAvailability = [
    // Tutor CB002: Mai Đức Trung
    {
        id: 1,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Monday',
        date: '2025-11-24',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-201',
        type: 'offline',
        status: 'available',
        note: 'Có thể dạy Lập trình C/C++ cơ bản'
    },
    {
        id: 2,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Wednesday',
        date: '2025-11-26',
        startTime: '09:00',
        endTime: '11:00',
        location: 'H1-201',
        type: 'offline',
        status: 'available',
        note: 'Ưu tiên lớp ôn tập giữa kỳ'
    },
    {
        id: 3,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Friday',
        date: '2025-11-28',
        startTime: '14:00',
        endTime: '17:00',
        location: 'Online - Google Meet',
        type: 'online',
        status: 'available',
        note: 'Buổi học online qua Google Meet'
    },

    // Tutor CB003: Bùi Công Tuấn
    {
        id: 4,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Tuesday',
        date: '2025-11-25',
        startTime: '13:00',
        endTime: '15:00',
        location: 'H2-305',
        type: 'offline',
        status: 'available',
        note: 'Chuyên về Java cơ bản và OOP'
    },
    {
        id: 5,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Thursday',
        date: '2025-11-27',
        startTime: '10:00',
        endTime: '12:00',
        location: 'H2-305',
        type: 'offline',
        status: 'available',
        note: 'Lớp luyện tập bài tập lớn'
    },
    {
        id: 6,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Saturday',
        date: '2025-11-29',
        startTime: '08:00',
        endTime: '11:00',
        location: 'Online - Zoom',
        type: 'online',
        status: 'available',
        note: 'Buổi review cuối tuần - Online'
    },

    // Tutor CB001: Nguyễn Đình Thuận
    {
        id: 7,
        mscb: 'CB001',
        tutorName: 'Nguyễn Đình Thuận',
        dayOfWeek: 'Monday',
        date: '2025-10-20',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H3-102',
        type: 'offline',
        status: 'booked',
        note: 'Lớp Công nghệ phần mềm - L01'
    },
    {
        id: 8,
        mscb: 'CB001',
        tutorName: 'Nguyễn Đình Thuận',
        dayOfWeek: 'Wednesday',
        date: '2025-10-22',
        startTime: '15:00',
        endTime: '17:00',
        location: 'H3-102',
        type: 'offline',
        status: 'available',
        note: 'Ôn tập đồ án môn học'
    }
];

module.exports = tutorAvailability;

// ================== TUTOR AVAILABILITY ==================
// Lịch rảnh của các tutors (CHỈ THỜI GIAN RẢNH)
// Tham chiếu tutor bằng mscb
// Student sẽ nhập môn học, địa điểm, loại buổi học, ghi chú khi đặt lịch

const tutorAvailability = [
    // Tutor CB002: Mai Đức Trung
    {
        id: 1,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Monday',
        date: '2025-12-02',
        startTime: '14:00',
        endTime: '16:00',
        status: 'available'
    },
    {
        id: 2,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Wednesday',
        date: '2025-12-04',
        startTime: '09:00',
        endTime: '11:00',
        status: 'available'
    },
    {
        id: 3,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Friday',
        date: '2025-12-06',
        startTime: '14:00',
        endTime: '17:00',
        status: 'available'
    },
    {
        id: 4,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Saturday',
        date: '2025-12-07',
        startTime: '08:00',
        endTime: '12:00',
        status: 'available'
    },

    // Tutor CB003: Bùi Công Tuấn
    {
        id: 5,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Tuesday',
        date: '2025-12-03',
        startTime: '13:00',
        endTime: '15:00',
        status: 'available'
    },
    {
        id: 6,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Thursday',
        date: '2025-12-05',
        startTime: '10:00',
        endTime: '12:00',
        status: 'available'
    },
    {
        id: 7,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Saturday',
        date: '2025-12-07',
        startTime: '08:00',
        endTime: '11:00',
        status: 'available'
    },
    {
        id: 8,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        dayOfWeek: 'Sunday',
        date: '2025-12-08',
        startTime: '14:00',
        endTime: '17:00',
        status: 'available'
    },

    // Tutor CB001: Lê Đình Thuận
    {
        id: 9,
        mscb: 'CB001',
        tutorName: 'Lê Đình Thuận',
        dayOfWeek: 'Monday',
        date: '2025-12-02',
        startTime: '14:00',
        endTime: '16:00',
        status: 'available'
    },
    {
        id: 10,
        mscb: 'CB001',
        tutorName: 'Lê Đình Thuận',
        dayOfWeek: 'Wednesday',
        date: '2025-12-04',
        startTime: '16:00',
        endTime: '18:00',
        status: 'available'
    },
    {
        id: 11,
        mscb: 'CB001',
        tutorName: 'Lê Đình Thuận',
        dayOfWeek: 'Friday',
        date: '2025-12-06',
        startTime: '09:00',
        endTime: '12:00',
        status: 'available'
    },
    {
        id: 12,
        mscb: 'CB001',
        tutorName: 'Lê Đình Thuận',
        dayOfWeek: 'Saturday',
        date: '2025-12-07',
        startTime: '15:00',
        endTime: '18:00',
        status: 'available'
    }
];

module.exports = tutorAvailability;

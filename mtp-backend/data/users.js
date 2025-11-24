// ================== USERS ==================
const users = [
    {
        id: 1,
        username: 'nhu.nguyen@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Nguyễn Quỳnh Như',
        mssv: '2312535',
        sex: 'Nữ',
        birthDate: '2005-03-13',
        identityCard: '054309001152',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'nhu.nguyen@hcmut.edu.vn',
        phone: '0901234567'
    },
    
    {
        id: 2,
        username: 'mai.tran@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Nguyễn Trần Phương Mai',
        mssv: '2312022',
        sex: 'Nữ',
        birthDate: '2005-05-16',
        identityCard: '054309001153',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'mai.tran@hcmut.edu.vn',
        phone: '0901234568'
    },

    {
        id: 3,
        username: 'thu.ngo@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Ngô Minh Thư',
        mssv: '2313384',
        sex: 'Nữ',
        birthDate: '2005-06-28',
        identityCard: '054309001154',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'thu.ngo@hcmut.edu.vn',
        phone: '0901234569'
    },

    {
        id: 4,
        username: 'ngoc.le@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Lê Hồng Ngọc',
        mssv: '2312303',
        sex: 'Nữ',
        birthDate: '2005-03-16',
        identityCard: '054309001155',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'ngoc.le@hcmut.edu.vn',
        phone: '0901234570'
    },

    {
        id: 5,
        username: 'nghiem.trinh@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Trịnh Duy Nghiêm',
        mssv: '2312256',
        sex: 'Nam',
        birthDate: '2005-03-17',
        identityCard: '054309001156',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'nghiem.trinh@hcmut.edu.vn',
        phone: '0901234571'
    },

    {
        id: 6,
        username: 'quan.truong@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: 'Trương Đỗ Anh Quân',
        mssv: '2312859',
        sex: 'Nam',
        birthDate: '2005-03-18',
        identityCard: '054309001157',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'quan.truong@hcmut.edu.vn',
        phone: '0901234572'
    },

    {
        id: 7,
        username: 'huy.banh@hcmut.edu.vn',
        password: '123456',
        role: 'student',
        name: ' Bành Huỳnh Minh Huy',
        mssv: '2311118',
        sex: 'Nam',
        birthDate: '2005-03-19',
        identityCard: '054309001158',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'huy.banh@hcmut.edu.vn',
        phone: '0901234573'
    },

    {
        id: 8,
        username: 'mdtrung@hcmut.edu.vn',
        password: '123456',
        role: 'tutor',
        name: 'Mai Đức Trung',
        mssv: '1921156',
        sex: 'Nam',
        birthDate: '1987-01-01',
        identityCard: '123456789012',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'mdtrung@hcmut.edu.vn',
        phone: '0901234573'
    },

    {
        id: 9,
        username: 'ldthuan@hcmut.edu.vn',
        password: '123456',
        role: 'tutor',
        name: 'Lê Đình Thuận',
        mssv: '1921157',
        sex: 'Nam',
        birthDate: '1987-05-01',
        identityCard: '123456789012',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'ldthuan@hcmut.edu.vn',
        phone: '0901234573'
    },

    {
        id: 10,
        username: 'ngoc.bui@hcmut.edu.vn',
        password: '123456',
        role: 'tutor',
        name: 'Bùi Thế Ngọc',
        mssv: '1921158',
        sex: 'Nam',
        birthDate: '1987-06-01',
        identityCard: '123456789012',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'ngoc.bui@hcmut.edu.vn',
        phone: '0901234573'
    }
];

// ================== SESSIONS ==================
const sessions = [
    {
        id: 1,
        tutorId: 3,
        tutorName: 'Mai Đức Trung',
        title: 'Lập trình hướng đối tượng cơ bản',
        subject: 'Lập trình C++',
        description: 'Học về class, object, inheritance',
        date: '2025-11-24',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-101',
        type: 'offline',
        maxStudents: 10,
        currentStudents: 0,
        status: 'open',
        students: [2312535, 2312022, 2312256, 2313384, 2311118]
    },
    
    {
        id: 2,
        tutorId: 2,
        tutorName: 'Lê Đình Thuận',
        title: 'Lập trình nâng cao',
        subject: 'Lập trình Java',
        description: 'Học về design patterns và best practices',
        date: '2025-11-25',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-102',
        type: 'offline',
        maxStudents: 10,
        currentStudents: 0,
        status: 'open',
        students: [2312535, 2312022, 2312256, 2313384, 2311118]
    },

    {
        id: 3,
        tutorId: 1,
        tutorName: 'Mai Đức Trung',
        title: 'Lập trình hướng đối tượng nâng cao',
        subject: 'Lập trình C++',
        description: 'Học về class, object, inheritance',
        date: '2025-11-26',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-103',
        type: 'offline',
        maxStudents: 10,
        currentStudents: 0,
        status: 'open',
        students: [2312535, 2312022, 2312256, 2313384, 2311118]
    }
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

// ================== TUTOR AVAILABILITY (Lịch rảnh của Tutor) ==================
const tutorAvailability = [
    // Tutor 1: Mai Đức Trung
    {
        id: 1,
        tutorId: 1,
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Monday', // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
        date: '2025-11-24', // Ngày cụ thể (optional, nếu là lịch cố định thì để null)
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-201',
        type: 'offline', // offline, online
        status: 'available', // available, booked, cancelled
        note: 'Có thể dạy các môn: Lập trình C, C++, Python'
    },
    {
        id: 2,
        tutorId: 1,
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Wednesday',
        date: '2025-11-26',
        startTime: '09:00',
        endTime: '11:00',
        location: 'H1-201',
        type: 'offline',
        status: 'available',
        note: 'Ưu tiên dạy Toán cao cấp'
    },
    {
        id: 3,
        tutorId: 1,
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

    // Tutor 2: Phạm Văn Thành
    {
        id: 4,
        tutorId: 2,
        tutorName: 'Phạm Văn Thành',
        dayOfWeek: 'Tuesday',
        date: '2025-11-25',
        startTime: '13:00',
        endTime: '15:00',
        location: 'H2-305',
        type: 'offline',
        status: 'available',
        note: 'Chuyên về Cấu trúc dữ liệu và Giải thuật'
    },
    {
        id: 5,
        tutorId: 2,
        tutorName: 'Phạm Văn Thành',
        dayOfWeek: 'Thursday',
        date: '2025-11-27',
        startTime: '10:00',
        endTime: '12:00',
        location: 'H2-305',
        type: 'offline',
        status: 'available',
        note: 'Ưu tiên dạy thuật toán nâng cao'
    },
    {
        id: 6,
        tutorId: 2,
        tutorName: 'Phạm Văn Thành',
        dayOfWeek: 'Saturday',
        date: '2025-11-29',
        startTime: '08:00',
        endTime: '11:00',
        location: 'Online - Zoom',
        type: 'online',
        status: 'available',
        note: 'Buổi review cuối tuần - Online'
    },

    // Tutor 3: Nguyễn Thị Lan Anh
    {
        id: 7,
        tutorId: 3,
        tutorName: 'Nguyễn Thị Lan Anh',
        dayOfWeek: 'Monday',
        date: '2025-11-24',
        startTime: '15:00',
        endTime: '17:00',
        location: 'H3-102',
        type: 'offline',
        status: 'booked', // Đã có người đặt
        note: 'Đã đầy - Không nhận thêm'
    },
    {
        id: 8,
        tutorId: 3,
        tutorName: 'Nguyễn Thị Lan Anh',
        dayOfWeek: 'Wednesday',
        date: '2025-11-26',
        startTime: '16:00',
        endTime: '18:00',
        location: 'H3-102',
        type: 'offline',
        status: 'available',
        note: 'Dạy Vật lý đại cương, Toán cao cấp'
    },
    {
        id: 9,
        tutorId: 3,
        tutorName: 'Nguyễn Thị Lan Anh',
        dayOfWeek: 'Friday',
        date: '2025-11-28',
        startTime: '13:00',
        endTime: '16:00',
        location: 'Online - MS Teams',
        type: 'online',
        status: 'available',
        note: 'Buổi học online qua Teams'
    },

    // Thêm lịch cho tuần sau (1/12 - 7/12)
    {
        id: 10,
        tutorId: 1,
        tutorName: 'Mai Đức Trung',
        dayOfWeek: 'Monday',
        date: '2025-12-01',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-201',
        type: 'offline',
        status: 'available',
        note: 'Lịch cố định hàng tuần'
    },
    {
        id: 11,
        tutorId: 2,
        tutorName: 'Phạm Văn Thành',
        dayOfWeek: 'Tuesday',
        date: '2025-12-02',
        startTime: '13:00',
        endTime: '15:00',
        location: 'H2-305',
        type: 'offline',
        status: 'available',
        note: 'Lịch cố định hàng tuần'
    },
    {
        id: 12,
        tutorId: 3,
        tutorName: 'Nguyễn Thị Lan Anh',
        dayOfWeek: 'Wednesday',
        date: '2025-12-03',
        startTime: '16:00',
        endTime: '18:00',
        location: 'H3-102',
        type: 'offline',
        status: 'available',
        note: 'Lịch cố định hàng tuần'
    }
];

// Export tất cả dữ liệu
module.exports = {
    users,
    sessions,
    registeredSessions,
    notifications,
    evaluations,
    tutorAvailability
};
// ================== SESSIONS ==================
// Các buổi học được tạo bởi tutors
// Tham chiếu tutor bằng mscb, danh sách sinh viên bằng mssv

const sessions = [
    {
        id: 1,
        mscb: 'CB001',
        tutorName: 'Nguyễn Đình Thuận',
        title: 'Công nghệ phần mềm - L01',
        subject: 'Công nghệ phần mềm',
        description: 'Ôn lại quy trình phát triển phần mềm và UML cơ bản',
        date: '2025-10-18',
        startTime: '13:00',
        endTime: '15:00',
        location: 'Online - Google Meet',
        type: 'online',
        maxStudents: 16,
        currentStudents: 1,
        status: 'open',
        students: ['2313384']        // Ngô Minh Thư (màn hình dashboard)
    },
    {
        id: 2,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        title: 'Lập trình C++ - L01',
        subject: 'Lập trình C++',
        description: 'Class, object, inheritance cơ bản',
        date: '2025-11-24',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-101',
        type: 'offline',
        maxStudents: 16,
        currentStudents: 5,
        status: 'open',
        students: ['2312535', '2312022', '2312256', '2313384', '2312303']
    },
    {
        id: 3,
        mscb: 'CB002',
        tutorName: 'Mai Đức Trung',
        title: 'Lập trình C++ - L02',
        subject: 'Lập trình C++',
        description: 'Template, STL và exception handling',
        date: '2025-11-26',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-103',
        type: 'offline',
        maxStudents: 16,
        currentStudents: 4,
        status: 'open',
        students: ['2312535', '2312022', '2312256', '2313384']
    },
    {
        id: 4,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        title: 'Lập trình Java - L01',
        subject: 'Lập trình Java',
        description: 'OOP trong Java và collection framework',
        date: '2025-11-25',
        startTime: '14:00',
        endTime: '16:00',
        location: 'H1-102',
        type: 'offline',
        maxStudents: 16,
        currentStudents: 3,
        status: 'open',
        students: ['2312256', '2312303', '2313384']
    },
    {
        id: 5,
        mscb: 'CB003',
        tutorName: 'Bùi Công Tuấn',
        title: 'Lập trình Java - L02',
        subject: 'Lập trình Java',
        description: 'Spring Boot cơ bản cho web service',
        date: '2025-11-28',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Online - Zoom',
        type: 'online',
        maxStudents: 20,
        currentStudents: 2,
        status: 'open',
        students: ['2312535', '2313384']
    }
];

module.exports = sessions;

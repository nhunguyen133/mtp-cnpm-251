// ================== USERS ==================
// Danh sách users (students + tutors)
// - Student định danh bằng mssv
// - Tutor định danh bằng mscb

const users = [
    // ===== STUDENTS =====
    {
        username: 'thu.ngo',
        password: '123456',
        role: 'student',
        name: 'Ngô Minh Thư',
        mssv: '2313384',
        sex: 'Nữ',
        birthDate: '2005-05-18',
        identityCard: '051300000001',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'thu.ngo@hcmut.edu.vn',
        phone: '0345803076'
    },
    {
        username: 'nhu.nguyen',
        password: '123456',
        role: 'student',
        name: 'Nguyễn Quỳnh Như',
        mssv: '2312535',
        sex: 'Nữ',
        birthDate: '2005-03-13',
        identityCard: '051300000002',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'nhu.nguyen@hcmut.edu.vn',
        phone: '0901234567'
    },
    {
        username: 'mai.nguyen',
        password: '123456',
        role: 'student',
        name: 'Nguyễn Trần Phương Mai',
        mssv: '2312022',
        sex: 'Nữ',
        birthDate: '2005-05-16',
        identityCard: '051300000003',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'mai.nguyen@hcmut.edu.vn',
        phone: '0901234568'
    },
    {
        username: 'ngoc.le',
        password: '123456',
        role: 'student',
        name: 'Lê Hồng Ngọc',
        mssv: '2312303',
        sex: 'Nữ',
        birthDate: '2005-03-16',
        identityCard: '051300000004',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'ngoc.le@hcmut.edu.vn',
        phone: '0901234570'
    },
    {
        username: 'nghiem.trinh',
        password: '123456',
        role: 'student',
        name: 'Trịnh Duy Nghiêm',
        mssv: '2312256',
        sex: 'Nam',
        birthDate: '2005-03-17',
        identityCard: '051300000005',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Khoa học Máy tính',
        email: 'nghiem.trinh@hcmut.edu.vn',
        phone: '0901234571'
    },

    // ===== TUTORS =====
    {
        username: 'ldthuan',
        password: '123456',
        role: 'tutor',
        name: 'Lê Đình Thuận',
        mscb: 'CB001',
        sex: 'Nam',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Công nghệ phần mềm',
        email: 'ndthuan@hcmut.edu.vn',
        phone: '0902000001'
    },
    {
        username: 'mdtrung',
        password: '123456',
        role: 'tutor',
        name: 'Mai Đức Trung',
        mscb: 'CB002',
        sex: 'Nam',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Lập trình C/C++',
        email: 'mdtrung@hcmut.edu.vn',
        phone: '0902000002'
    },
    {
        username: 'bctuan',
        password: '123456',
        role: 'tutor',
        name: 'Bùi Công Tuấn',
        mscb: 'CB003',
        sex: 'Nam',
        faculty: 'Khoa Khoa học và Kỹ thuật Máy tính',
        major: 'Lập trình Java',
        email: 'bctuan@hcmut.edu.vn',
        phone: '0902000003'
    },
    //ADMIN
    {
        username: 'admin',
        password: '123456',
        role: 'admin',
        name: 'Nguyễn Văn Admin',
        mscb: 'AD001',
        sex: 'Nam',
        faculty: 'Phòng Quản trị hệ thống',
        major: 'Quản trị mạng',
        email: 'admin@hcmut.edu.vn',
        phone: '0902000004'
    }
];

module.exports = users;

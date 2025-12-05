const meetings = [
    {   // Demo cho tutor Mai Đức Trung
        id: 1,
        mscb: 'CB002', // Gắn với Mai Đức Trung
        subject: 'Lập trình C++',
        class: 'L01',
        time: '14:00 - 16:00',
        date: '24/12/2025',
        count: '5/16',
        status: 'Đã mở',
        format: 'Online',
        room: 'Google Meet'
    },
    {
        id: 2,
        mscb: 'CB002',
        subject: 'Lập trình nâng cao',
        class: 'L01',
        time: '14:00 - 16:00',
        date: '26/12/2025',
        count: '3/16',
        status: 'Đã mở',
        format: 'Offline',
        room: 'H6-202'
    },
    {
        id: 3,
        mscb: 'CB002',
        subject: 'Hệ cơ sở dữ liệu',
        class: 'L02',
        time: '10:00 - 12:00',
        date: '16/12/2025',
        count: '1/16',
        status: 'Đã mở',
        format: 'Offline',
        room: 'H1-104'
    },
    {
        id: 4,
        mscb: 'CB002',
        subject: 'Kiến trúc phần mềm',
        class: 'L01',
        time: '09:00 - 11:00',
        date: '04/12/2025',
        count: '1/16',
        status: 'Chờ xác nhận',
        format: 'Offline',
        room: '--'
    }

];

module.exports = meetings;
// // ================== REGISTERED SESSIONS ==================
// ================== REGISTERED SESSIONS ==================
// Quan hệ giữa students và sessions (đăng ký buổi học)
// Tham chiếu student bằng mssv

const registrations = [
    {
        id: 1,
        sessionId: 1,
        mssv: '2313384',
        status: 'confirmed',
        registeredAt: '2025-10-10T10:30:00'
    },
    {
        id: 2,
        sessionId: 2,
        mssv: '2313384',
        status: 'confirmed',
        registeredAt: '2025-11-20T11:00:00'
    },
    {
        id: 3,
        sessionId: 4,
        mssv: '2313384',
        status: 'confirmed',
        registeredAt: '2025-11-20T11:30:00'
    },
    {
        id: 4,
        sessionId: 2,
        mssv: '2312535',
        status: 'confirmed',
        registeredAt: '2025-11-20T12:00:00'
    },
    {
        id: 5,
        sessionId: 3,
        mssv: '2312535',
        status: 'confirmed',
        registeredAt: '2025-11-20T12:30:00'
    },
    {
        id: 6,
        sessionId: 2,
        mssv: '2312022',
        status: 'pending',
        registeredAt: '2025-11-21T09:00:00'
    },
    {
        id: 7,
        sessionId: 5,
        mssv: '2312256',
        status: 'confirmed',
        registeredAt: '2025-11-21T09:30:00'
    }
];

module.exports = registrations;

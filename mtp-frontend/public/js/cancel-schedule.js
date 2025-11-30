let selectedSessionId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'student') {
        window.location.href = '/shared/login.html'; return;
    }

    loadRegisteredSessions();
});

async function loadRegisteredSessions() {
    const container = document.getElementById('schedule-list');
    try {
        const res = await MTP_API.getStudentSessions();
        const sessions = res.data || [];

        if (sessions.length === 0) {
            container.innerHTML = '<p style="text-align:center; margin-top:50px;">Bạn chưa đăng ký lịch học nào.</p>';
            return;
        }

        // Nhóm session theo Tutor Name (Vì backend trả về list phẳng)
        const grouped = {};
        sessions.forEach(s => {
            if (!grouped[s.tutorName]) {
                grouped[s.tutorName] = {
                    info: { name: s.tutorName, email: 'contact@hcmut.edu.vn', faculty: 'Khoa học và Kỹ thuật Máy tính' }, // Mock info vì API session chưa đủ
                    sessions: []
                };
            }
            grouped[s.tutorName].sessions.push(s);
        });

        // Render UI
        container.innerHTML = Object.values(grouped).map(group => `
            <div class="tutor-schedule-card">
                <div class="tutor-header-bg">
                    <div class="tutor-avatar-large">
                        <span class="material-icons" style="font-size:40px">person</span>
                    </div>
                    <div class="tutor-info-main">
                        <h3>${group.info.name}</h3>
                        <a href="#" class="link-detail">Chi tiết người dùng</a>
                    </div>
                </div>

                <div class="tutor-body">
                    <div class="info-row">
                        <div class="info-group">
                            <label>Email học vụ</label>
                            <div class="info-box">${group.info.email}</div>
                        </div>
                        <div class="info-group">
                            <label>Khoa</label>
                            <div class="info-box">${group.info.faculty}</div>
                        </div>
                    </div>

                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th>Lớp</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Địa điểm</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${group.sessions.map(s => `
                                <tr>
                                    <td>${s.subject}</td>
                                    <td>${formatDate(s.date)}</td>
                                    <td>${s.startTime} - ${s.endTime}</td>
                                    <td>${s.location || 'Online'}</td>
                                    <td style="text-align:center">
                                        <button class="btn-cancel-red" onclick="openCancelModal(${s.id}, '${s.subject}')">Hủy</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Lỗi tải dữ liệu.</p>';
    }
}

function formatDate(dateStr) {
    if(!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// Modal Logic
window.openCancelModal = function(sessionId, sessionName) {
    selectedSessionId = sessionId;
    document.getElementById('modal-msg').innerText = `Bạn có chắc chắn muốn hủy lớp "${sessionName}" không?`;
    document.getElementById('cancelModal').classList.add('active');
}

window.closeModal = function() {
    document.getElementById('cancelModal').classList.remove('active');
    selectedSessionId = null;
}

document.getElementById('confirmCancelBtn').addEventListener('click', async () => {
    if (!selectedSessionId) return;
    
    // Gọi API Hủy
    try {
        const res = await MTP_API.unregisterSession(selectedSessionId);
        if (res.success || res.message) { // Backend mock trả về {message: ...}
            alert('Đã hủy lịch thành công.');
            closeModal();
            loadRegisteredSessions(); // Reload lại list
        } else {
            alert('Lỗi khi hủy lịch.');
        }
    } catch (err) {
        alert('Lỗi kết nối server.');
    }
});
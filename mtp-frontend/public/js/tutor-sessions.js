document.addEventListener('DOMContentLoaded', async () => {
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }
    loadSessions();
});

async function loadSessions() {
    const res = await MTP_API.getTutorCreatedSessions();
    const sessions = res.data || [];
    const tbody = document.querySelector('#session-table tbody');
    
    tbody.innerHTML = sessions.map(s => `
        <tr>
            <td>${s.subject}</td>
            <td>${s.date} <br> ${s.time}</td>
            <td>${s.registeredStudents}/${s.maxStudents}</td>
            <td>${s.location || 'Online'}</td>
            <td>
                <button onclick="viewStudents(${s.id})" style="background:#4CAF50; color:#fff; border:none; padding:5px 10px; cursor:pointer;">DS SV</button>
                <button onclick="deleteSession(${s.id})" style="background:#f44336; color:#fff; border:none; padding:5px 10px; cursor:pointer;">Xóa</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" align="center">Chưa có lớp nào</td></tr>';
}

async function viewStudents(id) {
    const res = await MTP_API.getSessionStudents(id);
    const list = (res.data || []).map(s => `- ${s.name} (${s.mssv})`).join('\n');
    alert(list ? 'Danh sách sinh viên:\n' + list : 'Chưa có sinh viên đăng ký.');
}

async function deleteSession(id) {
    if(confirm('Xóa lớp này?')) {
        await MTP_API.deleteTutorSession(id);
        alert('Đã xóa');
        loadSessions();
    }
}
window.viewStudents = viewStudents;
window.deleteSession = deleteSession;
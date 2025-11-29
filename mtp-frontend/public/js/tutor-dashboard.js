document.addEventListener('DOMContentLoaded', async () => {
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }

    // Load sessions
    const res = await MTP_API.getTutorCreatedSessions();
    const sessions = res.data || [];
    
    // Update Stats
    document.getElementById('total-sessions').textContent = sessions.length;

    // Render list
    const container = document.getElementById('tutor-session-list');
    if(sessions.length === 0) {
        container.innerHTML = '<p>Chưa có lớp học nào.</p>';
    } else {
        container.innerHTML = sessions.map(s => `
            <div class="session-card" style="background:#e3f2fd;">
                <div class="course-name">${s.subject}</div>
                <div>${s.date} | ${s.time}</div>
                <div>Sĩ số: <strong>${s.registeredStudents}/${s.maxStudents}</strong></div>
                <div style="margin-top:10px; font-style:italic;">${s.location || 'Online'}</div>
            </div>
        `).join('');
    }
});
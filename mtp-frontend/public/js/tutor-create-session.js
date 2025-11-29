document.addEventListener('DOMContentLoaded', async () => {
    // Check auth
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }

    document.getElementById('createForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            subject: document.getElementById('subject').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            location: document.getElementById('location').value,
            maxStudents: parseInt(document.getElementById('maxStudents').value)
        };
        try {
            const res = await MTP_API.createTutorSession(data);
            if(res.success) {
                alert('Tạo thành công!');
                window.location.href = 'my-sessions.html';
            } else alert('Lỗi: ' + res.message);
        } catch(err) { alert('Lỗi kết nối server'); }
    });
});
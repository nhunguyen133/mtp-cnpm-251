document.addEventListener('DOMContentLoaded', async () => {
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }
    loadClasses();
});

async function loadClasses() {
    try {
        const res = await MTP_API.getTutorClasses(); // API lấy lớp
        const tbody = document.getElementById('class-tbody');
        
        if (res.success && res.data.length > 0) {
            tbody.innerHTML = res.data.map(c => `
                <tr>
                    <td>${c.subject}</td>
                    <td>${c.title.split('-')[1] || 'L01'}</td>
                    <td>${c.schedule}</td>
                    <td>${c.students.length} SV</td>
                    <td><button class="btn-view" onclick="showStudentList(${c.id})">Xem</button></td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" align="center">Chưa có lớp nào.</td></tr>';
        }
    } catch (e) { console.error(e); }
}

async function showStudentList(classId) {
    const section = document.getElementById('student-list-section');
    const tbody = document.getElementById('student-tbody');
    const title = document.getElementById('selected-class-title');
    
    tbody.innerHTML = '<tr><td colspan="5" align="center">Đang tải...</td></tr>';
    section.style.display = 'block';
    
    try {
        const res = await MTP_API.getClassStudents(classId);
        if (res.success) {
            title.innerText = `Danh sách sinh viên lớp ${res.classTitle}`;
            
            if (res.data.length > 0) {
                tbody.innerHTML = res.data.map((s, index) => `
                    <tr>
                        <td>${index+1}</td>
                        <td>${s.name}</td>
                        <td>${s.mssv}</td>
                        <td>${s.email}</td>
                        <!-- Truyền MSSV qua URL -->
                        <td><button class="btn-view" onclick="window.location.href='student-detail.html?mssv=${s.mssv}'">Chọn</button></td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="5" align="center">Lớp này chưa có sinh viên.</td></tr>';
            }
        }
    } catch (e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="5" align="center">Lỗi tải dữ liệu.</td></tr>';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    // Lấy MSSV từ URL
    const params = new URLSearchParams(window.location.search);
    const mssv = params.get('mssv');

    if (!mssv) {
        alert("Không tìm thấy sinh viên!");
        window.location.href = 'student-progress.html';
        return;
    }

    // 1. Fetch Dữ liệu thật (Info)
    try {
        const res = await MTP_API.getStudentInfoByMSSV(mssv);
        if (res.success) {
            const u = res.data;
            document.getElementById('std-name').innerText = u.name;
            document.getElementById('std-mssv').innerText = u.mssv;
            document.getElementById('std-major').innerText = u.major;
            document.getElementById('std-email').innerText = u.email;
            document.getElementById('std-status').innerText = u.status;
        }
    } catch (e) { console.error(e); }

    // 2. Load Mock Data (Điểm số, Lịch sử)
    loadMockData();
});

function loadMockData() {
    // Random số liệu cho sinh động
    const gpa = (Math.random() * (4.0 - 2.0) + 2.0).toFixed(1);
    const completed = Math.floor(Math.random() * 15) + 5;
    const cancelled = Math.floor(Math.random() * 3);
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

    document.getElementById('mock-gpa').innerText = gpa;
    document.getElementById('mock-completed').innerText = completed;
    document.getElementById('mock-cancelled').innerText = cancelled;
    document.getElementById('mock-rating').innerHTML = `${rating} / 5 <span class="material-icons" style="font-size:20px">star</span>`;

    // Mock Lịch sử
    const historyBody = document.getElementById('history-tbody');
    historyBody.innerHTML = `
        <tr><td style="padding:8px">Công nghệ phần mềm</td><td>28/10/2025</td><td><span style="background:#d4edda; padding:2px 5px; border-radius:4px; font-size:11px;">Đã hoàn thành</span></td></tr>
        <tr><td style="padding:8px">Lập trình nâng cao</td><td>21/10/2025</td><td><span style="background:#d4edda; padding:2px 5px; border-radius:4px; font-size:11px;">Đã hoàn thành</span></td></tr>
        <tr><td style="padding:8px">Công nghệ phần mềm</td><td>15/10/2025</td><td><span style="background:#f8d7da; padding:2px 5px; border-radius:4px; font-size:11px;">Đã hủy</span></td></tr>
    `;

    // Mock Môn học
    const subList = document.getElementById('subject-list');
    subList.innerHTML = `
        <li>Cấu trúc Dữ liệu & Giải thuật (Điểm: <span style="color:blue">${(Math.random()*3+6).toFixed(1)}</span>)</li>
        <li>Lập trình Hướng đối tượng (Điểm: <span style="color:blue">${(Math.random()*3+6).toFixed(1)}</span>)</li>
        <li>Hệ điều hành (Điểm: <span style="color:blue">${(Math.random()*3+6).toFixed(1)}</span>)</li>
    `;

    // Mock Feedback
    const fbList = document.getElementById('feedback-list');
    fbList.innerHTML = `
        <div style="font-size:13px; margin-bottom:10px;">
            <strong>Buổi ngày 28/10 (5/5 <span class="material-icons" style="font-size:12px; color:#f1c40f">star</span>)</strong>
            <p style="font-style:italic; color:#555; margin-top:2px;">"Tutor giải thích dễ hiểu, tài liệu rất hữu ích."</p>
        </div>
        <div style="font-size:13px;">
            <strong>Buổi ngày 21/10 (4.5/5 <span class="material-icons" style="font-size:12px; color:#f1c40f">star</span>)</strong>
            <p style="font-style:italic; color:#555; margin-top:2px;">"Buổi học tốt, nhưng đôi khi nói hơi nhanh."</p>
        </div>
    `;
}
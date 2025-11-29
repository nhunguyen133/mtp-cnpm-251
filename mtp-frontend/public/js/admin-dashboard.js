/**
 * Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Auth (Admin Only)
    try {
        const userRes = await MTP_API.getCurrentUser();
        if (!userRes.loggedIn || userRes.user.role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này');
            window.location.href = '../shared/login.html';
            return;
        }
    } catch (e) {
        window.location.href = '../shared/login.html';
    }

    // 2. Load Dữ liệu ban đầu
    loadStatistics();
    loadReports();

    // 3. Gắn sự kiện nút "Xem báo cáo"
    const btnSearch = document.getElementById('btn-view-report');
    if (btnSearch) {
        btnSearch.addEventListener('click', handleFilterClick);
    }
});

/**
 * Tải số liệu thống kê (Stats Cards)
 */
async function loadStatistics() {
    try {
        const res = await MTP_API.getAdminStats();
        if (res.success) {
            const data = res.data;
            // Hiệu ứng đếm số (Optional: gán thẳng giá trị nếu không cần hiệu ứng)
            document.getElementById('stat-students').innerText = data.totalStudents;
            document.getElementById('stat-tutors').innerText = data.activeTutors;
            // Format số có dấu phẩy (2,250)
            document.getElementById('stat-sessions').innerText = data.completedSessions.toLocaleString();
            document.getElementById('stat-rating').innerText = data.avgRating;
        }
    } catch (error) {
        console.error('Lỗi tải thống kê:', error);
    }
}

/**
 * Tải dữ liệu bảng
 */
async function loadReports(filters = {}) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Đang tải dữ liệu...</td></tr>';

    try {
        // Giả lập độ trễ mạng để thấy hiệu ứng loading
        await new Promise(r => setTimeout(r, 500));

        const res = await MTP_API.getAdminReports(filters);
        const data = res.data || [];

        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Không có dữ liệu</td></tr>';
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.faculty}</td>
                <td>${item.subject}</td>
                <td class="text-center">${item.students}</td>
                <td class="text-center">${item.rating} / 5</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Lỗi tải bảng:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Lỗi kết nối server</td></tr>';
    }
}

/**
 * Xử lý sự kiện click nút "Xem báo cáo"
 */
function handleFilterClick() {
    const subject = document.getElementById('filter-subject').value;
    const time = document.getElementById('filter-time').value;
    
    // Hiển thị thông báo nhỏ hoặc animation nút bấm
    const btn = document.getElementById('btn-view-report');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lọc...';
    btn.disabled = true;

    // Gọi lại hàm load bảng với filter mới
    loadReports({ subject, time }).then(() => {
        // Reset nút bấm
        btn.innerHTML = originalText;
        btn.disabled = false;
        // alert('Đã cập nhật dữ liệu báo cáo!'); // Bỏ comment nếu muốn hiện thông báo
    });
}

/**
 * Xử lý sự kiện phân trang
 */
window.changePage = function(pageNum) {
    // 1. Update UI active class
    const buttons = document.querySelectorAll('.page-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText == pageNum) {
            btn.classList.add('active');
        }
    });

    // 2. Reload data (Giả lập chuyển trang)
    loadReports();
}
// Biến toàn cục
let currentDate = new Date(2025, 9, 10); // Mặc định tháng 10/2025 như ảnh (tháng trong JS bắt đầu từ 0 -> 9 là tháng 10)
let selectedDateKey = null; // Lưu ngày đang được click chuột phải

// Mock data lưu trạng thái các ngày (Key dạng "YYYY-MM-DD")
// Bạn có thể thêm dữ liệu mẫu để khớp với ảnh 
const scheduleData = {
    "2025-10-10": "busy",   // Đen
    "2025-10-18": "opened", // Vàng
    "2025-10-24": "opened", // Vàng
    "2025-10-28": "free",   // Xanh
    "2025-10-30": "free"    // Xanh
};

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }
    
    renderCalendar();

    // Ẩn menu chuột phải khi click ra ngoài
    document.addEventListener('click', () => {
        document.getElementById('context-menu').style.display = 'none';
    });
});

/**
 * Vẽ lịch
 */
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Cập nhật tiêu đề
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    document.getElementById('current-month-year').innerText = `${monthNames[month]} ${year}`;

    const calBody = document.getElementById('calendar-body');
    calBody.innerHTML = '';

    // Vẽ Header Thứ (Su -> Sa)
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    days.forEach(day => {
        calBody.innerHTML += `<div class="cal-head">${day}</div>`;
    });

    // Tính toán ngày
    const firstDay = new Date(year, month, 1).getDay(); // Thứ của ngày mùng 1
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Tổng số ngày trong tháng

    // Ô trống đầu tháng
    for (let i = 0; i < firstDay; i++) {
        calBody.innerHTML += `<div class="cal-cell" style="background:#f9f9f9"></div>`;
    }

    // Các ô ngày chính thức
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const status = scheduleData[dateKey];
        
        let statusClass = '';
        if (status === 'free') statusClass = 'status-free';
        else if (status === 'opened') statusClass = 'status-opened';
        else if (status === 'busy') statusClass = 'status-busy';

        // Tạo phần tử HTML cho ô ngày
        const cell = document.createElement('div');
        cell.className = `cal-cell ${statusClass}`;
        cell.innerHTML = `<span class="date-num">${d}</span>`;
        
        // Gắn sự kiện Chuột phải
        cell.addEventListener('contextmenu', (e) => showContextMenu(e, dateKey));

        calBody.appendChild(cell);
    }
}

/**
 * Xử lý chuyển tháng
 */
function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    renderCalendar();
}

/**
 * Hiển thị Context Menu tại vị trí chuột
 */
function showContextMenu(e, dateKey) {
    e.preventDefault(); // Chặn menu mặc định của trình duyệt
    selectedDateKey = dateKey;

    const menu = document.getElementById('context-menu');
    menu.style.display = 'block';
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
}

function setDayStatus(status) {
    document.getElementById('context-menu').style.display = 'none';

    if (!selectedDateKey) return;

    // CASE 1: ĐÃ MỞ (Vàng)
    if (status === 'opened') {
        document.getElementById('sessionTime').value = formatDateDisplay(selectedDateKey);
        document.getElementById('openSessionModal').classList.add('active');
    } 
    // CASE 2: LỊCH RẢNH (Xanh)
    else if (status === 'free') {
        document.getElementById('inputFreeTime').value = '';
        document.getElementById('inputFreeTime').focus();
        document.getElementById('freeTimeModal').classList.add('active');
    }
    // CASE 3: XÓA (None)
    else if (status === null) {
        if (scheduleData[selectedDateKey]) {
            document.getElementById('deleteConfirmModal').classList.add('active');
        }
    }
    // CASE 4: LỊCH TRÌNH (Đen) --> SỬA ĐOẠN NÀY
    else if (status === 'busy') {
        // Thay vì update luôn, ta hiện Modal
        document.getElementById('scheduleConfirmModal').classList.add('active');
    }
}

/**
 * XÁC NHẬN: LỊCH TRÌNH (ĐEN)
 */
function confirmSetBusy() {
    updateCalendarStatus('busy');
    closeModals();
}

/**
 * Hàm chung đóng tất cả modal
 */
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
}

/**
 * XÁC NHẬN: THIẾT LẬP LỊCH RẢNH (XANH)
 */
function confirmSetFree() {
    const timeVal = document.getElementById('inputFreeTime').value;
    if (!timeVal) {
        alert("Vui lòng nhập giờ!");
        return;
    }
    
    // Lưu dữ liệu (Mock)
    // scheduleData[selectedDateKey] = { type: 'free', time: timeVal }; 
    // Ở đây ta lưu string 'free' để tương thích logic vẽ màu cũ, 
    // thực tế nên lưu object để hiển thị giờ lên UI
    
    updateCalendarStatus('free');
    closeModals();
}

/**
 * XÁC NHẬN: MỞ BUỔI HỌC (VÀNG)
 */
function confirmOpenSession() {
    const name = document.getElementById('sessionName').value;
    if(!name) {
        alert("Vui lòng nhập tên buổi học!");
        return;
    }
    updateCalendarStatus('opened');
    closeModals();
    // Reset form
    document.getElementById('sessionForm').reset();
}

/**
 * XÁC NHẬN: XÓA (TRẮNG)
 */
function confirmDelete() {
    updateCalendarStatus(null); // Xóa data
    closeModals();
}

/**
 * Cập nhật trạng thái vào data và vẽ lại
 */
function updateCalendarStatus(status) {
    if (status === null) {
        delete scheduleData[selectedDateKey];
    } else {
        scheduleData[selectedDateKey] = status;
    }
    renderCalendar();
}

// Helper format YYYY-MM-DD -> DD/MM/YYYY
function formatDateDisplay(ymd) {
    if(!ymd) return '';
    const p = ymd.split('-');
    return `${p[2]}/${p[1]}/${p[0]}`;
}

// Export global
window.changeMonth = changeMonth;
window.setDayStatus = setDayStatus;
window.closeModals = closeModals;
window.confirmOpenSession = confirmOpenSession;
window.confirmSetFree = confirmSetFree;
window.confirmDelete = confirmDelete;   

// Export global
window.changeMonth = changeMonth;
window.setDayStatus = setDayStatus;
window.closeSessionModal = closeSessionModal;
window.confirmOpenSession = confirmOpenSession;

// Export functions to global if needed
window.changeMonth = changeMonth;
window.setDayStatus = setDayStatus;
window.confirmSetBusy = confirmSetBusy;

/**
 * Choose Session Logic - Chọn buổi học cụ thể từ tutor đã chọn
 */

let tutorSessions = [];
let selectedSession = null;
let tutorMSCB = null;
let tutorName = null;

// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Kiểm tra authentication
        const userResponse = await MTP_API.getCurrentUser();
        
        if (!userResponse.loggedIn || userResponse.user.role !== 'student') {
            window.location.href = '/shared/login.html';
            return;
        }

        // 2. Lấy tutorMSCB từ URL hoặc localStorage
        const urlParams = new URLSearchParams(window.location.search);
        tutorMSCB = urlParams.get('tutorMSCB') || localStorage.getItem('selectedTutorMSCB');
        tutorName = localStorage.getItem('selectedTutorName');

        if (!tutorMSCB) {
            alert('Không tìm thấy thông tin tutor. Vui lòng chọn tutor trước.');
            window.location.href = 'register-session.html';
            return;
        }

        // 3. Load sessions của tutor
        await loadTutorSessions();

        // 4. Setup modal handlers
        setupModalHandlers();

    } catch (error) {
        console.error('Error loading choose session page:', error);
        showError('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
});

/**
 * Load danh sách sessions của tutor
 */
async function loadTutorSessions() {
    try {
        // Lấy tất cả sessions có thể đăng ký
        const response = await MTP_API.getAvailableSessions();
        const allSessions = response.data || [];

        // Filter by mscb
        tutorSessions = allSessions.filter(s => s.mscb === tutorMSCB);

        // Update tutor info
        updateTutorInfo();

        // Render sessions
        renderSessions();

    } catch (error) {
        console.error('Error loading tutor sessions:', error);
        showError('Không thể tải danh sách buổi học');
    }
}

/**
 * Update thông tin tutor ở header
 */
function updateTutorInfo() {
    const titleEl = document.getElementById('pageTitle');
    
    if (tutorSessions.length > 0) {
        const tutorName = tutorSessions[0].tutorName;
        titleEl.textContent = `Lịch các lớp của tutor ${tutorName}`;
    } else {
        titleEl.textContent = `Lịch các lớp của tutor ${tutorName || 'Tutor'}`;
    }
}

/**
 * Render danh sách sessions dạng table
 */
function renderSessions() {
    const container = document.getElementById('sessionsContainer');
    
    if (!tutorSessions || tutorSessions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p style="font-size: 18px; color: #666;">Chưa có buổi học nào</p>
                <p>Tutor này hiện chưa mở buổi học nào.</p>
                <br>
                <button class="btn-new-schedule" onclick="showNewScheduleOption()">
                    <span class="material-icons">add_circle_outline</span>
                    Đặt lịch mới với tutor
                </button>
                <br><br>
                <a href="register-session.html" style="color: #264574; text-decoration: underline;">
                    ← Hoặc quay lại chọn tutor khác
                </a>
            </div>
        `;
        return;
    }

    // Tạo table HTML
    container.innerHTML = `
        <table class="session-table">
            <thead>
                <tr>
                    <th>Lớp</th>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Sĩ số</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${tutorSessions.map(session => createSessionRow(session)).join('')}
            </tbody>
        </table>
        <button class="btn-new-schedule" onclick="showNewScheduleOption()">
            <span class="material-icons">add_circle_outline</span>
            Đặt lịch mới
        </button>
    `;
}

/**
 * Tạo HTML cho mỗi session row trong table
 */
function createSessionRow(session) {
    const isFull = session.currentStudents >= session.maxStudents;
    const siSo = `${session.currentStudents}/${session.maxStudents}`;
    
    return `
        <tr>
            <td>${session.title || 'L0' + session.id}</td>
            <td>${formatDate(session.date)}</td>
            <td>${session.startTime} - ${session.endTime}</td>
            <td>${siSo}</td>
            <td style="text-align:center">
                <button 
                    class="btn-register" 
                    onclick="openConfirmModal(${session.id})"
                    ${isFull ? 'disabled' : ''}
                >
                    ${isFull ? 'Đã đầy' : 'Đăng ký'}
                </button>
            </td>
        </tr>
    `;
}

/**
 * Format date
 */
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Open confirmation modal
 */
function openConfirmModal(sessionId) {
    selectedSession = tutorSessions.find(s => s.id === sessionId);
    
    if (!selectedSession) {
        alert('Không tìm thấy buổi học');
        return;
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <p style="margin-bottom: 16px;">Bạn có chắc chắn muốn đăng ký buổi học này?</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
            <h3 style="margin-bottom: 12px; color: #264574;">${selectedSession.title || 'L0' + selectedSession.id}</h3>
            <p style="margin-bottom: 8px;"><strong>Giảng viên:</strong> ${selectedSession.tutorName}</p>
            <p style="margin-bottom: 8px;"><strong>Môn học:</strong> ${selectedSession.subject}</p>
            <p style="margin-bottom: 8px;"><strong>Ngày:</strong> ${formatDate(selectedSession.date)}</p>
            <p style="margin-bottom: 8px;"><strong>Giờ:</strong> ${selectedSession.startTime} - ${selectedSession.endTime}</p>
            <p style="margin-bottom: 8px;"><strong>Sĩ số:</strong> ${selectedSession.currentStudents}/${selectedSession.maxStudents}</p>
            ${selectedSession.type ? `<p><strong>Địa điểm:</strong> ${selectedSession.type === 'online' ? 'Online' : selectedSession.location}</p>` : ''}
        </div>
    `;

    const modal = document.getElementById('confirmModal');
    modal.classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    selectedSession = null;
}

/**
 * Confirm registration
 */
async function confirmRegistration() {
    if (!selectedSession) {
        showError('Không tìm thấy buổi học');
        return;
    }

    try {
        const confirmBtn = document.querySelector('.btn-confirm');
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Đang xử lý...';
        confirmBtn.disabled = true;

        // Call API
        const response = await MTP_API.registerSession(selectedSession.id);

        if (response.success) {
            closeModal();
            showSuccess('Đăng ký thành công! Bạn có thể xem lịch đã đăng ký ở trang Home.');
            
            // Reload sau 2s và redirect về dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            showError(response.message || 'Đăng ký thất bại');
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        }

    } catch (error) {
        console.error('Error registering session:', error);
        showError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        
        const confirmBtn = document.querySelector('.btn-confirm');
        confirmBtn.textContent = 'Xác nhận';
        confirmBtn.disabled = false;
    }
}

/**
 * Setup modal handlers
 */
function setupModalHandlers() {
    const modal = document.getElementById('confirmModal');
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Show success message
 */
function showSuccess(message) {
    alert(message);
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

/**
 * Hiển thị tùy chọn đặt lịch mới (chuyển sang trang lịch rảnh)
 */
function showNewScheduleOption() {
    // Chuyển sang trang đặt lịch mới với tutor hiện tại
    window.location.href = `book-new-schedule.html?tutorMSCB=${tutorMSCB}&tutorName=${encodeURIComponent(tutorName)}`;
}

// Make functions global
window.openConfirmModal = openConfirmModal;
window.closeModal = closeModal;
window.confirmRegistration = confirmRegistration;
window.showNewScheduleOption = showNewScheduleOption;

console.log('Choose Session JS loaded');

/**
 * Cancel Session Logic - Hủy lịch
 */

let myRegistrations = [];
let selectedRegistration = null;

// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Kiểm tra authentication
        const userResponse = await MTP_API.getCurrentUser();
        
        if (!userResponse.loggedIn || userResponse.user.role !== 'student') {
            window.location.href = '/shared/login.html';
            return;
        }

        // 2. Load danh sách lịch đã đăng ký
        await loadMyRegistrations();

    } catch (error) {
        console.error('Error loading cancel session page:', error);
        alert('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
});

/**
 * Load danh sách lịch đã đăng ký của sinh viên
 */
async function loadMyRegistrations() {
    try {
        const response = await MTP_API.getStudentSessions();
        myRegistrations = response.data || [];

        console.log('Loaded my registrations:', myRegistrations);

        // Group by tutor
        renderTutorList();

    } catch (error) {
        console.error('Error loading registrations:', error);
        showError('Không thể tải danh sách lịch đã đăng ký');
    }
}

/**
 * Render danh sách tutor với các lớp đã đăng ký
 */
function renderTutorList() {
    const container = document.getElementById('tutorListContainer');

    if (!container) {
        console.error('Container not found');
        return;
    }

    if (!myRegistrations || myRegistrations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">event_busy</span>
                <h3>Chưa có lịch đã đăng ký</h3>
                <p>Bạn chưa đăng ký lớp học nào.</p>
                <br>
                <a href="register-session.html" style="color: #264574; text-decoration: underline;">
                    → Đăng ký lịch học mới
                </a>
            </div>
        `;
        return;
    }

    // Group registrations by tutor
    const tutorMap = new Map();
    myRegistrations.forEach(reg => {
        // Sử dụng tutorName làm key vì data không có mscb
        const tutorKey = reg.tutorName || 'Tutor';
        
        if (!tutorMap.has(tutorKey)) {
            tutorMap.set(tutorKey, {
                tutorName: tutorKey,
                sessions: []
            });
        }
        tutorMap.get(tutorKey).sessions.push(reg);
    });

    container.innerHTML = '';
    
    tutorMap.forEach((tutorData) => {
        const tutorCard = createTutorCard(tutorData);
        container.appendChild(tutorCard);
    });
}

/**
 * Tạo card cho mỗi tutor
 */
function createTutorCard(tutorData) {
    const div = document.createElement('div');
    div.className = 'tutor-card';
    
    // Lấy session đầu tiên để có thông tin tutor
    const firstSession = tutorData.sessions[0];
    const tutorEmail = firstSession.tutorEmail || 'email@hcmut.edu.vn';
    const tutorFaculty = firstSession.faculty || 'Khoa học và Kỹ thuật máy tính';
    
    div.innerHTML = `
        <div class="tutor-header">
            <div class="tutor-avatar">
                <span class="material-icons">account_circle</span>
            </div>
            <div class="tutor-info">
                <h2 class="tutor-name">${tutorData.tutorName}</h2>
            </div>
        </div>

        <div class="contact-info">
            <div class="info-field">
                <label class="info-label">Email học vụ</label>
                <div class="info-value">${tutorEmail}</div>
            </div>
            <div class="info-field">
                <label class="info-label">Khoa</label>
                <div class="info-value">${tutorFaculty}</div>
            </div>
        </div>
        
        <hr class="divider-can">
        
        <div class="sessions-style">
            <table class="sessions-table">
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
                    ${tutorData.sessions.map(session => `
                        <tr>
                            <td>${session.title || session.subject}</td>
                            <td>${formatDate(session.date)}</td>
                            <td>${session.startTime} - ${session.endTime}</td>
                            <td>${session.currentStudents || 0}/${session.maxStudents}</td>
                            <td>
                                <button 
                                    class="btn-cancel-session" 
                                    onclick="openCancelModal(${session.id}, '${(session.title || session.subject).replace(/'/g, "\\'")}', '${session.date}', '${session.startTime}')"
                                >
                                    Hủy
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    return div;
}

/**
 * Format ngày tháng
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Mở modal xác nhận hủy
 */
function openCancelModal(sessionId, sessionName, date, startTime) {
    // Kiểm tra thời gian hủy (phải trước 3 tiếng)
    const sessionDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    const hoursDiff = (sessionDateTime - now) / (1000 * 60 * 60);

    if (hoursDiff < 3) {
        alert('Quá hạn thời gian hủy lịch!\n\nBạn chỉ có thể hủy lịch trước ít nhất 3 tiếng so với thời gian bắt đầu buổi hẹn.');
        return;
    }

    selectedRegistration = myRegistrations.find(r => r.id === sessionId);
    
    if (!selectedRegistration) {
        alert('Không tìm thấy lịch này');
        return;
    }

    // Show modal
    const modal = document.getElementById('cancelModal');
    modal.classList.add('show');
}

/**
 * Đóng modal
 */
function closeCancelModal() {
    const modal = document.getElementById('cancelModal');
    modal.classList.remove('show');
    selectedRegistration = null;
}

/**
 * Xác nhận hủy lịch
 */
async function confirmCancel() {
    if (!selectedRegistration) {
        alert('Vui lòng chọn lịch cần hủy');
        return;
    }

    // Disable button to prevent double click
    const confirmBtn = document.querySelector('.btn-confirm-cancel');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Đang xử lý...';

    try {
        const response = await MTP_API.unregisterSession(selectedRegistration.id);

        if (response.success) {
            alert(response.message || 'Hủy lịch thành công!');
            closeCancelModal();
            
            // Reload để cập nhật danh sách
            await loadMyRegistrations();
        } else {
            alert(response.error || 'Không thể hủy lịch. Vui lòng thử lại.');
        }

    } catch (error) {
        console.error('Error canceling session:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        // Re-enable button
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Xác nhận';
    }
}

/**
 * Hiển thị lỗi
 */
function showError(message) {
    const container = document.getElementById('tutorListContainer');
    container.innerHTML = `
        <div class="empty-state">
            <span class="material-icons" style="color: #f44336;">error_outline</span>
            <h3>Có lỗi xảy ra</h3>
            <p>${message}</p>
            <br>
            <button onclick="loadMyRegistrations()" 
                    style="padding: 10px 20px; background: #264574; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Thử lại
            </button>
        </div>
    `;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cancelModal');
    if (event.target === modal) {
        closeCancelModal();
    }
}

console.log('Cancel Session JS loaded');

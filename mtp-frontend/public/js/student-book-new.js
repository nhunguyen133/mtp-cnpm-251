/**
 * Book New Schedule Logic - Đặt lịch mới với tutor
 */

let tutorMSCB = '';
let tutorName = '';
let tutorEmail = '';
let availabilitySlots = [];
let selectedSlot = null;

// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Kiểm tra authentication
        const userResponse = await MTP_API.getCurrentUser();
        
        if (!userResponse.loggedIn || userResponse.user.role !== 'student') {
            window.location.href = '/shared/login.html';
            return;
        }

        // 2. Lấy thông tin tutor từ URL hoặc localStorage
        const urlParams = new URLSearchParams(window.location.search);
        tutorMSCB = urlParams.get('tutorMSCB') || localStorage.getItem('selectedTutorMSCB');
        tutorName = urlParams.get('tutorName') || localStorage.getItem('selectedTutorName');
        tutorEmail = urlParams.get('tutorEmail') || localStorage.getItem('selectedTutorEmail');

        if (!tutorMSCB) {
            alert('Không tìm thấy thông tin tutor. Vui lòng chọn lại.');
            window.location.href = 'register-session.html';
            return;
        }

        // 3. Update tutor info
        updateTutorInfo();

        // 4. Load availability slots
        await loadAvailabilitySlots();

    } catch (error) {
        console.error('Error loading book new schedule page:', error);
        alert('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
});

/**
 * Update thông tin tutor ở header
 * Bao gồm tên và email
 */
function updateTutorInfo() {
    document.getElementById('tutorName').textContent = tutorName || 'Tutor';
    document.getElementById('tutorEmail').textContent = `Email: ${tutorEmail}` || 'Email không có';
}

/**
 * Load danh sách lịch rảnh của tutor
 */
async function loadAvailabilitySlots() {
    try {
        const response = await MTP_API.getTutorAvailability(tutorMSCB);
        availabilitySlots = response.data || [];

        console.log('Loaded availability slots:', availabilitySlots);

        // Render slots
        renderAvailabilitySlots();

    } catch (error) {
        console.error('Error loading availability slots:', error);
        showError('Không thể tải lịch rảnh của tutor');
    }
}

/**
 * Render danh sách lịch rảnh dạng BẢNG ĐƠN GIẢN
 */
function renderAvailabilitySlots() {
    const container = document.getElementById('availabilityContainer');

    if (!container) {
        console.error('Container not found');
        return;
    }

    if (!availabilitySlots || availabilitySlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">event_busy</span>
                <h3>Chưa có lịch rảnh</h3>
                <p>Tutor này hiện chưa có lịch rảnh. Vui lòng thử lại sau.</p>
                <br>
                <a href="register-session.html" style="color: #264574; text-decoration: underline;">
                    ← Quay lại chọn tutor khác
                </a>
            </div>
        `;
        return;
    }

    // Tạo bảng đơn giản
    let tableHTML = `
        <table class="availability-table">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    availabilitySlots.forEach(slot => {
        const isAvailable = slot.status === 'available';
        tableHTML += `
            <tr>
                <td>${formatDate(slot.date)}</td>
                <td>${slot.startTime} - ${slot.endTime}</td>
                <td>
                    <button 
                        class="btn-book-simple" 
                        onclick="openBookingModal(${slot.id})"
                        ${!isAvailable ? 'disabled' : ''}
                    >
                        Đặt lịch
                    </button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
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
 * Format thứ
 */
function formatDayOfWeek(day) {
    const days = {
        'Monday': 'T2',
        'Tuesday': 'T3',
        'Wednesday': 'T4',
        'Thursday': 'T5',
        'Friday': 'T6',
        'Saturday': 'T7',
        'Sunday': 'CN'
    };
    return days[day] || day;
}

/**
 * Mở modal xác nhận đặt lịch
 */
function openBookingModal(slotId) {
    selectedSlot = availabilitySlots.find(s => s.id === slotId);
    
    if (!selectedSlot) {
        alert('Không tìm thấy lịch này');
        return;
    }

    // TỰ ĐỘNG LẤY MÔN HỌC đã tìm kiếm
    const searchedSubject = localStorage.getItem('searchedSubject') || 'Chưa xác định';

    // Fill modal data - CHỈ HIỂN THỊ, KHÔNG CHO NHẬP
    document.getElementById('modalTutorName').textContent = tutorName;
    document.getElementById('modalSubject').textContent = searchedSubject;
    document.getElementById('modalDateTime').textContent = 
        `${formatDate(selectedSlot.date)} (${formatDayOfWeek(selectedSlot.dayOfWeek)}), ${selectedSlot.startTime} - ${selectedSlot.endTime}`;

    // Show modal
    const modal = document.getElementById('confirmModal');
    modal.classList.add('show');
}

/**
 * Đóng modal
 */
function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('show');
    selectedSlot = null;
}

/**
 * Xác nhận đặt lịch
 */
async function confirmBooking() {
    if (!selectedSlot) {
        alert('Vui lòng chọn lịch');
        return;
    }

    // Lấy thông tin đã có
    const subject = localStorage.getItem('searchedSubject') || 'Chưa xác định';

    // Disable button to prevent double click
    const confirmBtn = document.querySelector('.btn-confirm');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Đang xử lý...';

    try {
        const response = await MTP_API.createBookingRequest(
            selectedSlot.id,
            subject,
            '',
            '',
            ''
        );

        if (response.success) {
            alert(response.message || 'Gửi yêu cầu đặt lịch thành công!\nTutor sẽ xác nhận trong thời gian sớm nhất.');
            closeModal();
            
            // Reload slots to update status
            await loadAvailabilitySlots();
        } else {
            alert(response.error || 'Không thể đặt lịch. Vui lòng thử lại.');
        }

    } catch (error) {
        console.error('Error creating booking request:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        // Re-enable button
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span class="material-icons">check_circle</span> Xác nhận đặt lịch';
    }
}

/**
 * Hiển thị lỗi
 */
function showError(message) {
    const container = document.getElementById('availabilityContainer');
    container.innerHTML = `
        <div class="empty-state">
            <span class="material-icons" style="color: #f44336;">error_outline</span>
            <h3>Có lỗi xảy ra</h3>
            <p>${message}</p>
            <br>
            <button onclick="loadAvailabilitySlots()" 
                    style="padding: 10px 20px; background: #264574; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Thử lại
            </button>
        </div>
    `;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeModal();
    }
}

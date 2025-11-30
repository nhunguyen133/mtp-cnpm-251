/**
 * Logic Quản lý buổi gặp (Meeting Management)
 */

let currentMeetingId = null; // ID buổi gặp đang thao tác

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }
    
    loadMeetings();
});

// --- LOAD MAIN TABLE ---
async function loadMeetings() {
    try {
        const res = await MTP_API.getTutorMeetings();
        const tbody = document.getElementById('meeting-tbody');
        
        if (res.success && res.data.length > 0) {
            tbody.innerHTML = res.data.map(m => `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="width:300px; padding:10px; text-align:left;">${m.subject}</td>
                    <td style="width:100px; text-align:left;">${m.class}</td>
                    <td style="text-align:left;">${m.date}</td>
                    <td style="text-align:left;">${m.time}</td>
                    <td style="width:100px; text-align:left;">${m.count}</td>
                    <td style="font-weight:bold; padding-left:15px; text-align:left;">${m.status}</td>
                    <td align="center">
                        <button onclick="openDetail(${m.id})" style="background:#ccc; border:1px solid #999; padding:2px 10px; border-radius:3px; cursor:pointer; font-size:12px; font-weight:bold; display:inline-flex; align-items:center; gap:3px;">
                            Chi tiết <span class="material-icons" style="font-size:14px">mouse</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="7" align="center" style="padding:20px;">Chưa có buổi gặp nào</td></tr>';
        }
    } catch (e) { console.error(e); }
}

// --- MODAL CHI TIẾT ---
async function openDetail(id) {
    currentMeetingId = id;
    const res = await MTP_API.getMeetingDetail(id);
    if(!res.success) return;
    
    const m = res.data;
    const content = document.getElementById('detail-content');
    const actions = document.getElementById('detail-actions');
    const title = document.getElementById('detail-title');

    // Render thông tin vào lưới (Detail Grid)
    // Nếu là "Chờ xác nhận" thì KHÔNG hiển thị Hình thức và Phòng/Link
    if (m.status === 'Chờ xác nhận') {
        content.innerHTML = `
            <div class="detail-cell"><span class="detail-label">Môn</span><span class="detail-value">${m.subject}</span></div>
            <div class="detail-cell"><span class="detail-label">Lớp</span><span class="detail-value">${m.class}</span></div>
            
            <div class="detail-cell"><span class="detail-label">Ngày</span><span class="detail-value">${m.date}</span></div>
            <div class="detail-cell"><span class="detail-label">Giờ</span><span class="detail-value">${m.time}</span></div>
            
            <div class="detail-cell"><span class="detail-label">Sĩ số</span><span class="detail-value">${m.count}</span></div>
            <div class="detail-cell"><span class="detail-label">Trạng thái</span><span class="detail-value" style="font-weight:bold">${m.status}</span></div>
        `;
    } else {
        // Trạng thái khác thì hiển thị đầy đủ
        content.innerHTML = `
            <div class="detail-cell"><span class="detail-label">Môn</span><span class="detail-value">${m.subject}</span></div>
            <div class="detail-cell"><span class="detail-label">Lớp</span><span class="detail-value">${m.class}</span></div>
            
            <div class="detail-cell"><span class="detail-label">Ngày</span><span class="detail-value">${m.date}</span></div>
            <div class="detail-cell"><span class="detail-label">Giờ</span><span class="detail-value">${m.time}</span></div>
            
            <div class="detail-cell"><span class="detail-label">Hình thức</span><span class="detail-value">${m.format}</span></div>
            <div class="detail-cell"><span class="detail-label">Phòng/Link</span><span class="detail-value">${m.room}</span></div>
            
            <div class="detail-cell"><span class="detail-label">Sĩ số</span><span class="detail-value">${m.count}</span></div>
            <div class="detail-cell"><span class="detail-label">Trạng thái</span><span class="detail-value" style="font-weight:bold">${m.status}</span></div>
        `;
    }

    // Logic nút bấm dựa trên trạng thái
    if (m.status === 'Đã mở') {
        // Chỉ nút Hủy buổi gặp (cần lý do)
        title.innerText = "CHI TIẾT BUỔI GẶP";
        actions.innerHTML = `<button class="btn-red" onclick="openCancelReason()">Hủy buổi gặp</button>`;
    } else if (m.status === 'Chờ xác nhận') {
        // Xác nhận / Hủy lịch hẹn (không cần lý do)
        title.innerText = "CHI TIẾT LỊCH HẸN";
        actions.innerHTML = `
            <button class="btn-red" onclick="cancelAppointmentDirectly()">Hủy</button>
            <button class="btn-blue" onclick="openFormatSelection()">Xác nhận</button>
        `;
    } else {
        actions.innerHTML = `<button onclick="closeModals()">Đóng</button>`;
    }

    document.getElementById('detailModal').classList.add('active');
}

// --- MODAL HỦY ---
function openCancelReason() {
    document.getElementById('detailModal').classList.remove('active');
    document.getElementById('cancelReasonModal').classList.add('active');
    document.getElementById('cancelReasonInput').value = '';
}

// Hủy lịch hẹn trực tiếp (không cần lý do)
async function cancelAppointmentDirectly() {
    if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
        return;
    }
    
    // Gọi API cập nhật status -> Đã hủy (không cần lý do)
    await MTP_API.updateMeetingStatus(currentMeetingId, 'Đã hủy');
    closeModals();
    loadMeetings();
    alert("Đã hủy lịch hẹn.");
}

function backToDetail() {
    document.getElementById('cancelReasonModal').classList.remove('active');
    document.getElementById('detailModal').classList.add('active');
}

async function confirmCancelSubmit() {
    const reason = document.getElementById('cancelReasonInput').value;
    // Gọi API cập nhật status -> Đã hủy (hoặc xóa)
    await MTP_API.updateMeetingStatus(currentMeetingId, 'Đã hủy', reason);
    closeModals();
    loadMeetings();
    alert("Đã hủy buổi gặp.");
}

// Mở modal chọn hình thức khi xác nhận lịch hẹn
function openFormatSelection() {
    document.getElementById('detailModal').classList.remove('active');
    document.getElementById('formatSelectionModal').classList.add('active');
}

// Quay lại chi tiết từ modal chọn hình thức
function backToDetailFromFormat() {
    document.getElementById('formatSelectionModal').classList.remove('active');
    document.getElementById('detailModal').classList.add('active');
}

async function confirmMeeting() {
    const offlineCheckbox = document.getElementById('offlineCheckbox');
    const onlineCheckbox = document.getElementById('onlineCheckbox');
    const confirmLinkInput = document.getElementById('confirmLink');
    
    let format = '';
    let link = '';
    
    if (offlineCheckbox && offlineCheckbox.checked) {
        format = 'Offline';
    } else if (onlineCheckbox && onlineCheckbox.checked) {
        format = 'Online';
        link = confirmLinkInput ? confirmLinkInput.value.trim() : '';
        
        // Nếu chọn Online nhưng không nhập link thì cảnh báo
        if (!link) {
            alert("Vui lòng nhập link cho buổi gặp online!");
            return;
        }
    }
    
    if (!format) {
        alert("Vui lòng chọn hình thức!");
        return;
    }
    
    // Gọi API cập nhật status -> Đã mở và cập nhật format, link
    await MTP_API.updateMeetingStatus(currentMeetingId, 'Đã mở', null, format, link);
    closeModals();
    
    // Reset checkbox và link về mặc định
    if (offlineCheckbox) offlineCheckbox.checked = true;
    if (onlineCheckbox) onlineCheckbox.checked = false;
    if (confirmLinkInput) confirmLinkInput.value = '';
    
    loadMeetings();
    alert("Đã xác nhận buổi gặp.");
}

// --- MODAL MỞ MỚI ---
function openNewMeetingModal() {
    // Mở modal trực tiếp
    document.getElementById('newMeetingModal').classList.add('active');
}

async function submitNewMeeting() {
    const subject = document.getElementById('newSubject').value;
    const dateInput = document.getElementById('newDate').value; // YYYY-MM-DD
    const startTime = document.getElementById('newScheduleStartTime').value;
    const endTime = document.getElementById('newScheduleEndTime').value;
    const format = document.querySelector('input[name="format"]:checked')?.value || 'Offline';
    const link = document.getElementById('newLink').value;
    const desc = document.getElementById('newDesc').value;

    // Validate
    if (!subject || !dateInput || !startTime || !endTime) {
        alert("Vui lòng nhập đầy đủ: Môn học, Ngày, và Thời gian!");
        return;
    }

    // Validate time
    if (startTime >= endTime) {
        alert('Giờ bắt đầu phải trước giờ kết thúc');
        return;
    }

    // Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
    const [year, month, day] = dateInput.split('-');
    const date = `${day}/${month}/${year}`;

    // Format thời gian
    const time = `${startTime} - ${endTime}`;

    // Tự động tạo tên lớp dựa trên môn hiện có
    let className = 'L01'; // Mặc định
    try {
        const res = await MTP_API.getTutorMeetings();
        if (res.success && res.data.length > 0) {
            // Lọc các buổi cùng môn
            const samSubjectMeetings = res.data.filter(m => m.subject === subject);
            
            if (samSubjectMeetings.length > 0) {
                // Tìm số lớp cao nhất (L01, L02, L03...)
                const classNumbers = samSubjectMeetings
                    .map(m => {
                        const match = m.class.match(/L(\d+)/);
                        return match ? parseInt(match[1]) : 0;
                    })
                    .filter(num => num > 0);
                
                if (classNumbers.length > 0) {
                    const maxNum = Math.max(...classNumbers);
                    const nextNum = maxNum + 1;
                    className = `L${String(nextNum).padStart(2, '0')}`; // L01, L02, L03...
                }
            }
        }
    } catch (e) {
        console.error('Error getting existing meetings:', e);
        // Nếu lỗi, vẫn dùng L01 mặc định
    }

    // Gọi API tạo mới
    try {
        const res = await MTP_API.createNewMeeting({
            subject,
            className, // Tên lớp tự động
            date,
            time,
            format,
            link: format === 'Online' ? link : '',
            description: desc,
            maxStudents: 16, // Mặc định 16 sinh viên
            status: 'Đã mở' // Trạng thái mặc định là "Đã mở"
        });

        if (res.success) {
            closeModals();
            // Reset form
            document.getElementById('newSubject').value = '';
            document.getElementById('newDate').value = '';
            document.getElementById('newScheduleStartTime').value = '';
            document.getElementById('newScheduleEndTime').value = '';
            document.getElementById('newLink').value = '';
            document.getElementById('newDesc').value = '';
            
            await loadMeetings();
            alert(`Đã mở buổi gặp mới thành công! (Lớp: ${className})`);
        } else {
            alert("Lỗi: " + (res.message || "Không thể tạo buổi gặp"));
        }
    } catch (error) {
        console.error('Error creating meeting:', error);
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
}


let selectedClassIds = [];

// --- BƯỚC 1: MỞ DANH SÁCH LỚP ---
async function openNotifyModal() {
    const res = await MTP_API.getTutorClasses();
    const tbody = document.getElementById('class-tbody');
    
    if (res.success) {
        tbody.innerHTML = res.data.map(c => {
            // Fix lỗi ngày hiển thị "Nhật - Tư"
            const parts = c.schedule.trim().split(' ');
            const timeStr = parts.slice(-3).join(' '); // 3 phần tử cuối là giờ
            const dayStr = parts.slice(0, -3).join(' '); // Phần còn lại là Thứ

            return `
                <tr>
                    <td>${c.subject}</td>
                    <td>${c.title.split('-')[1] || 'L01'}</td>
                    <td>${dayStr}</td>
                    <td>${timeStr}</td>
                    <td>${c.students.length}/20</td>
                    <td align="center"><input type="checkbox" class="class-check" value="${c.id}"></td>
                </tr>
            `;
        }).join('');
    }
    // Mở Modal 1
    document.getElementById('notifyModal').classList.add('active');
}

// --- CHUYỂN TỪ BƯỚC 1 SANG BƯỚC 2 ---
function moveToCompose() {
    const checkboxes = document.querySelectorAll('.class-check:checked');
    if (checkboxes.length === 0) {
        alert("Vui lòng chọn ít nhất một lớp!");
        return;
    }
    
    // Lưu tạm các ID lớp đã chọn
    selectedClassIds = Array.from(checkboxes).map(cb => cb.value);

    // Ẩn Modal 1, Hiện Modal 2
    document.getElementById('notifyModal').classList.remove('active');
    document.getElementById('composeModal').classList.add('active');
}

// --- CHUYỂN TỪ BƯỚC 2 SANG BƯỚC 3 ---
function moveToConfirm() {
    const title = document.getElementById('notiTitle').value;
    const content = document.getElementById('notiContent').value;

    if (!title || !content) {
        alert("Vui lòng nhập tiêu đề và nội dung!");
        return;
    }

    // Ẩn Modal 2, Hiện Modal 3
    document.getElementById('composeModal').classList.remove('active');
    document.getElementById('confirmNotifyModal').classList.add('active');
}

// --- QUAY LẠI TỪ BƯỚC 3 VỀ BƯỚC 2 ---
function backToCompose() {
    document.getElementById('confirmNotifyModal').classList.remove('active');
    document.getElementById('composeModal').classList.add('active');
}

// --- BƯỚC CUỐI: GỬI API ---
async function finalSendNotification() {
    const title = document.getElementById('notiTitle').value;
    const content = document.getElementById('notiContent').value;
    const link = document.getElementById('notiLink').value;

    try {
        // Gọi API gửi thông báo (Backend cần update để nhận thêm title, content, link)
        // Hiện tại dùng hàm cũ sendClassNotification chỉ gửi ID
        // Bạn có thể update api-client.js nếu cần gửi full data
        
        // Giả lập gửi kèm data
        console.log("Sending...", { ids: selectedClassIds, title, content, link });
        
        const res = await MTP_API.sendClassNotification(selectedClassIds);
        
        if(res.success) {
            alert("Gửi thông báo thành công!");
            
            // Reset và đóng hết
            closeModals();
            document.getElementById('notiTitle').value = '';
            document.getElementById('notiContent').value = '';
            document.getElementById('notiLink').value = '';
            selectedClassIds = [];
        } else {
            alert("Lỗi: " + res.message);
        }
    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối server");
    }
}

// Hàm đóng tất cả modal (Dùng cho nút Hủy)
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
    // Reset biến tạm
    selectedClassIds = [];
}
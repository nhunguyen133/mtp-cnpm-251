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
                    <td style="padding:10px;">${m.subject}</td>
                    <td>${m.class}</td>
                    <td>${m.date}</td>
                    <td>${m.time}</td>
                    <td>${m.count}</td>
                    <td style="font-weight:bold;">${m.status}</td>
                    <td align="center">
                        <button onclick="openDetail(${m.id})" style="background:#ccc; border:1px solid #999; padding:2px 10px; border-radius:3px; cursor:pointer; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:3px;">
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

    // Logic nút bấm dựa trên trạng thái
    if (m.status === 'Đã mở') {
        // Chỉ nút Hủy
        title.innerText = "CHI TIẾT BUỔI GẶP";
        actions.innerHTML = `<button class="btn-red" onclick="openCancelReason()">Hủy buổi gặp</button>`;
    } else if (m.status === 'Chờ xác nhận') {
        // Xác nhận / Hủy
        title.innerText = "CHI TIẾT LỊCH HẸN";
        actions.innerHTML = `
            <button class="btn-red" onclick="openCancelReason()">Hủy</button>
            <button class="btn-blue" onclick="confirmMeeting()">Xác nhận</button>
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

async function confirmMeeting() {
    // Gọi API cập nhật status -> Đã mở
    await MTP_API.updateMeetingStatus(currentMeetingId, 'Đã mở');
    closeModals();
    loadMeetings();
    alert("Đã xác nhận buổi gặp.");
}

// --- MODAL MỞ MỚI ---
async function openNewMeetingModal() {
    // Load lịch rảnh từ API
    const res = await MTP_API.getTutorSchedules();
    const tbody = document.getElementById('avail-tbody');
    tbody.innerHTML = '';

    if (res.success) {
        // Lọc các ngày 'free' hoặc 'available'
        const freeSlots = res.data.filter(s => s.status === 'free' || s.status === 'available');
        
        freeSlots.forEach(slot => {
            // Hiển thị ngày dạng DD/MM/YYYY cho đẹp
            const dateParts = slot.date.split('-');
            const dateDisplay = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            
            tbody.innerHTML += `
                <tr>
                    <td style="padding:5px;">${dateDisplay}</td>
                    <td>${slot.time || slot.startTime + '-' + slot.endTime}</td>
                    <td align="center"><input type="radio" name="selectedSlot" value="${slot.date}|${slot.time}"></td>
                </tr>
            `;
        });
    }
    document.getElementById('newMeetingModal').classList.add('active');
}

async function submitNewMeeting() {
    const subject = document.getElementById('newSubject').value;
    const className = document.getElementById('newClassName').value; // MỚI: Lấy tên lớp
    const selected = document.querySelector('input[name="selectedSlot"]:checked');
    const format = document.querySelector('input[name="format"]:checked')?.value || 'Offline';
    const desc = document.getElementById('newDesc').value;

    // Validate thêm tên lớp
    if (!subject || !className || !selected) {
        alert("Vui lòng nhập đầy đủ: Môn học, Tên lớp và Chọn lịch!");
        return;
    }

    const [date, time] = selected.value.split('|');
    const dP = date.split('-');
    const dateFormatted = `${dP[2]}/${dP[1]}/${dP[0]}`;

    // Gọi API tạo mới kèm className
    await MTP_API.createNewMeeting({
        subject,
        className, // Gửi tên lớp lên server
        date: dateFormatted,
        time,
        format,
        description: desc
    });

    closeModals();
    loadMeetings();
    alert("Đã tạo buổi gặp mới (Chờ xác nhận).");
}


// --- MODAL GỬI THÔNG BÁO ---
async function openNotifyModal() {
    const res = await MTP_API.getTutorClasses();
    const tbody = document.getElementById('class-tbody');
    
    if (res.success) {
        tbody.innerHTML = res.data.map(c => {
            // XỬ LÝ CHUỖI NGÀY GIỜ THÔNG MINH HƠN
            // Chuỗi gốc ví dụ: "Chủ Nhật 14:00 - 16:00" hoặc "Thứ Hai 14:00 - 16:00"
            const parts = c.schedule.trim().split(' '); 
            
            // Giả định 3 phần tử cuối luôn là giờ (VD: "14:00", "-", "16:00")
            const timeStr = parts.slice(-3).join(' '); 
            
            // Tất cả các phần tử trước đó là Ngày (VD: "Chủ", "Nhật")
            const dayStr = parts.slice(0, -3).join(' ');

            return `
                <tr>
                    <td>${c.subject}</td>
                    <td>${c.title.split('-')[1] || 'L01'}</td>
                    <td>${dayStr}</td> <!-- Hiển thị đầy đủ: Chủ Nhật -->
                    <td>${timeStr}</td> <!-- Hiển thị giờ: 14:00 - 16:00 -->
                    <td>${c.students.length}/20</td>
                    <td align="center"><input type="checkbox" class="class-check" value="${c.id}"></td>
                </tr>
            `;
        }).join('');
    }
    document.getElementById('notifyModal').classList.add('active');
}
async function submitNotification() {
    const checkboxes = document.querySelectorAll('.class-check:checked');
    if (checkboxes.length === 0) {
        alert("Vui lòng chọn ít nhất một lớp!");
        return;
    }

    const ids = Array.from(checkboxes).map(cb => cb.value);
    
    // Gọi API gửi noti
    const res = await MTP_API.sendClassNotification(ids);
    
    closeModals();
    alert(res.message || "Đã gửi thông báo thành công!");
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
}
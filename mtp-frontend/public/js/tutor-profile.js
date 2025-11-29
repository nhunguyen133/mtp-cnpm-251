/**
 * Logic cho trang Profile Tutor
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Gọi API lấy thông tin User hiện tại
        const response = await MTP_API.getCurrentUser();
        
        if (!response.loggedIn || response.user.role !== 'tutor') {
            window.location.href = '/shared/login.html';
            return;
        }

        const user = response.user;

        // 2. Điền dữ liệu vào giao diện
        renderProfile(user);

    } catch (error) {
        console.error("Lỗi tải profile:", error);
    }
});

function renderProfile(user) {
    // Header Name
    document.getElementById('display-name').textContent = user.name;

    // Avatar Initials (Lấy chữ cái đầu)
    const avatarEl = document.querySelector('.profile-avatar');
    const initials = getInitials(user.name);
    avatarEl.innerHTML = `<span class="avatar-text">${initials}</span>`;
    avatarEl.classList.add('has-initial'); // Để kích hoạt CSS background màu xanh

    // Form Fields
    // Lưu ý: Các field này phải khớp với dữ liệu trong data.js hoặc API trả về
    setValue('mscb', user.mscb || 'Chưa cập nhật');
    setValue('gender', user.sex || user.gender || 'Nam'); // Mock mặc định nếu thiếu
    setValue('dob', formatDate(user.birthDate) || '18/05/1995'); // Mock mặc định nếu thiếu
    setValue('cccd', user.identityCard || '123456789012');
    setValue('phone', user.phone || '0901234573');
    setValue('major', user.major || 'Khoa học máy tính');
    setValue('faculty', user.faculty);
    setValue('email', user.email);
}

// Helper gán giá trị vào input
function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

// Helper lấy chữ cái đầu (VD: Mai Đức Trung -> MT)
function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper format ngày
function formatDate(dateStr) {
    if (!dateStr) return null;
    // Giả sử dateStr dạng YYYY-MM-DD
    const parts = dateStr.split('-');
    if(parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
}
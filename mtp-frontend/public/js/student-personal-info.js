/**
 * Student Personal Info Page - Logic
 * Xử lý hiển thị thông tin cá nhân
 */

// State
let currentUser = null;

// Initialize khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Load user info từ API
    loadPersonalInfo();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Load thông tin cá nhân từ API
 */
async function loadPersonalInfo() {
    try {
        showLoading();
        
        // Gọi API để lấy thông tin user
        const response = await fetch('http://localhost:3001/api/auth/me', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin người dùng');
        }
        
        const data = await response.json();
        
        if (data.loggedIn && data.user) {
            currentUser = data.user;
            displayPersonalInfo(data.user);
        } else {
            // Redirect về login nếu chưa đăng nhập
            window.location.href = 'http://localhost:3001/api/auth/login';
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading personal info:', error);
        hideLoading();
        showError('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
    }
}

/**
 * Hiển thị thông tin user lên UI
 */
function displayPersonalInfo(user) {
    // Update profile name
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = user.name || 'N/A';
    }
    
    // Update role badge
    const roleBox = document.querySelector('.role-box');
    if (roleBox) {
        const roleText = getRoleText(user.role);
        roleBox.textContent = roleText;
        roleBox.className = `role-box role-${user.role}`;
    }
    
    // Update form fields - Map đúng với users.js
    updateFormField('mssv', user.mssv || user.id || 'N/A');
    updateFormField('gender', user.sex || user.gender || 'Chưa cập nhật');
    updateFormField('dob', formatDate(user.birthDate || user.dob) || 'Chưa cập nhật');
    updateFormField('cccd', user.identityCard || user.cccd || 'Chưa cập nhật');
    updateFormField('phone', user.phone || 'Chưa cập nhật');
    updateFormField('faculty', user.faculty || 'Chưa cập nhật');
    updateFormField('major', user.major || 'Chưa cập nhật');
    updateFormField('email', user.email || user.username || 'N/A');
    
    // Update avatar với initial
    updateAvatar(user.name);
}

/**
 * Update form field value
 */
function updateFormField(fieldName, value) {
    // Tìm input bằng nhiều cách
    const selectors = [
        `input[name="${fieldName}"]`,
        `input[data-field="${fieldName}"]`,
        `#${fieldName}`
    ];
    
    for (const selector of selectors) {
        const input = document.querySelector(selector);
        if (input) {
            input.value = value;
            return;
        }
    }
    
    // Fallback: tìm theo label text
    const labels = document.querySelectorAll('.form-group label');
    labels.forEach(label => {
        const labelText = label.textContent.toLowerCase();
        const input = label.parentElement.querySelector('input');
        
        if (input) {
            if (fieldName === 'mssv' && labelText.includes('mssv')) {
                input.value = value;
            } else if (fieldName === 'gender' && labelText.includes('giới tính')) {
                input.value = value;
            } else if (fieldName === 'dob' && labelText.includes('ngày sinh')) {
                input.value = value;
            } else if (fieldName === 'cccd' && labelText.includes('cmnd') || labelText.includes('cccd')) {
                input.value = value;
            } else if (fieldName === 'phone' && labelText.includes('điện thoại')) {
                input.value = value;
            } else if (fieldName === 'faculty' && labelText.includes('khoa')) {
                input.value = value;
            } else if (fieldName === 'major' && labelText.includes('ngành')) {
                input.value = value;
            } else if (fieldName === 'email' && labelText.includes('email')) {
                input.value = value;
            }
        }
    });
}

/**
 * Update avatar với initial letters
 */
function updateAvatar(name) {
    const avatar = document.querySelector('.profile-avatar');
    if (!avatar || !name) return;
    
    // Lấy initials (VD: "Ngô Minh Thư" -> "NT")
    const names = name.trim().split(' ');
    let initials = '';
    
    if (names.length >= 2) {
        // Lấy chữ cái đầu của họ và tên
        initials = names[0].charAt(0) + names[names.length - 1].charAt(0);
    } else {
        // Nếu chỉ 1 từ, lấy 2 chữ cái đầu
        initials = name.substring(0, 2);
    }
    
    initials = initials.toUpperCase();
    
    // Thêm text vào avatar
    avatar.innerHTML = `<span class="avatar-text">${initials}</span>`;
    avatar.classList.add('has-initial');
}

/**
 * Get role text tiếng Việt
 */
function getRoleText(role) {
    const roleMap = {
        'student': 'Sinh viên',
        'tutor': 'Tutor',
        'admin': 'Quản trị viên'
    };
    
    return roleMap[role] || role;
}

/**
 * Format date DD/MM/YYYY
 */
function formatDate(dateString) {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        return dateString;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Chat icon click
    const chatIcon = document.querySelector('.profile-icons .material-icons:nth-child(1)');
    if (chatIcon) {
        chatIcon.addEventListener('click', handleChatClick);
    }
    
    // Group icon click
    const groupIcon = document.querySelector('.profile-icons .material-icons:nth-child(2)');
    if (groupIcon) {
        groupIcon.addEventListener('click', handleGroupClick);
    }
    
    // Back button click
    const backLink = document.querySelector('.breadcrumb-back');
    if (backLink) {
        backLink.addEventListener('click', handleBackClick);
    }
}

/**
 * Handle chat icon click
 */
function handleChatClick(e) {
    e.preventDefault();
    console.log('Chat clicked');
    // TODO: Implement chat functionality
    showNotification('Tính năng chat đang được phát triển', 'info');
}

/**
 * Handle group icon click
 */
function handleGroupClick(e) {
    e.preventDefault();
    console.log('Group clicked');
    // TODO: Implement group functionality
    showNotification('Tính năng nhóm đang được phát triển', 'info');
}

/**
 * Handle back button click
 */
function handleBackClick(e) {
    // Nếu có history, dùng back
    if (window.history.length > 1) {
        e.preventDefault();
        window.history.back();
    }
    // Nếu không, để mặc định navigate về dashboard.html
}

/**
 * Show loading state
 */
function showLoading() {
    const content = document.querySelector('.profile-content');
    if (content) {
        content.style.opacity = '0.5';
        content.style.pointerEvents = 'none';
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    const content = document.querySelector('.profile-content');
    if (content) {
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
    }
}

/**
 * Show error message
 */
function showError(message) {
    // Tạo error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <span class="material-icons">error</span>
        <span>${message}</span>
    `;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove sau 5s
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const colors = {
        'info': '#2196F3',
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#f44336'
    };
    
    const icons = {
        'info': 'info',
        'success': 'check_circle',
        'warning': 'warning',
        'error': 'error'
    };
    
    const notifDiv = document.createElement('div');
    notifDiv.className = 'notification';
    notifDiv.innerHTML = `
        <span class="material-icons">${icons[type]}</span>
        <span>${message}</span>
    `;
    notifDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notifDiv);
    
    // Auto remove sau 3s
    setTimeout(() => {
        notifDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notifDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions để có thể test hoặc dùng từ nơi khác
window.PersonalInfoPage = {
    loadPersonalInfo,
    displayPersonalInfo,
    updateFormField,
    showNotification,
    currentUser: () => currentUser
};

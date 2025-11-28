/**
 * Student Dashboard Logic
 * Ví dụ sử dụng MTP API Client
 */

// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Lấy thông tin user hiện tại
    const userResponse = await MTP_API.getCurrentUser();
    
    if (!userResponse.loggedIn) {
      // Chưa đăng nhập -> redirect về login
      window.location.href = '/shared/login.html';
      return;
    }
    
    const currentUser = userResponse.user;
    console.log('Current user:', currentUser);
    
    // 2. Hiển thị tên user lên UI
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
      userNameElement.textContent = currentUser.name.toUpperCase();
    }
    
    // 3. Lấy danh sách sessions của student (các session đã đăng ký)
    const sessionsResponse = await MTP_API.getStudentSessions();
    console.log('Student sessions:', sessionsResponse.data);
    
    // 4. Render sessions lên UI
    renderSessions(sessionsResponse.data);
    
    // 5. Lấy thông báo
    const notificationsResponse = await MTP_API.getNotifications();
    console.log('Notifications:', notificationsResponse.data);
    
    // 6. Hiển thị số lượng thông báo chưa đọc
    updateNotificationBadge(notificationsResponse.data);
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    
    // Nếu lỗi 401 (unauthorized), redirect về login
    if (error.message.includes('Unauthorized')) {
      window.location.href = '/shared/login.html';
    }
  }
});

/**
 * Render danh sách sessions lên UI
 */
function renderSessions(sessions) {
  const listElement = document.querySelector('.session-list');
  if (!listElement) return;

  listElement.innerHTML = ''; // clear list

  if (!sessions || sessions.length === 0) {
    listElement.innerHTML = `
      <div class="session-empty-state">
        <p>Bạn chưa đăng ký buổi học nào.</p>
      </div>
    `;
    return;
  }

  sessions.forEach(session => {
    listElement.insertAdjacentHTML('beforeend', createSessionCard(session));
  });
}

/**
 * Tạo HTML cho một session card
 */
function createSessionCard(session) {
  const typeIcon = session.type === 'online' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" height="29px" viewBox="0 -960 960 960" width="29px" fill="#000000"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" height="29px" viewBox="0 -960 960 960" width="29px" fill="#000000"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>';
  
  return `
    <section class="session-card">
      <!-- Hàng 1: course + giảng viên -->
      <div class="session-row">
        <div class="session-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#000000">
            <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
          </svg>
        </div>
        
        <div class="session-main-info">
          <div class="course-name">${session.subject || session.title}</div>
          <div class="lecturer">${session.tutorName}</div>
        </div>
      </div>

      <hr class="session-divider">

      <!-- Hàng 2: location/online + giờ -->
      <div class="session-row space-between">
        <div class="session-inline">
          ${typeIcon}
          <span class="session-label">${session.type === 'online' ? 'Online' : session.location}</span>
        </div>
        <div class="session-inline">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
          </svg>
          <div class="session-time">${session.startTime} - ${session.endTime}</div>
        </div>
      </div>

      <!-- Hàng 3: ngày + nút đánh giá -->
      <div class="session-row space-between last-row">
        <div class="session-inline">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
          </svg>
          <span class="session-date">${formatDate(session.date)}</span>
        </div>

        <button class="rate-btn" onclick="openEvaluationModal(${session.id})">
          <div class="session-inline">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#446CA9">
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
              </svg>
            </div>
            <span>Đánh giá</span>
          </div>
        </button>
      </div>
    </section>
  `;
}

/**
 * Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
 */
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Cập nhật số lượng thông báo chưa đọc
 */
function updateNotificationBadge(notifications) {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const badgeElement = document.querySelector('.notification-wrapper .badge');
  
  if (badgeElement) {
    badgeElement.textContent = unreadCount;
    
    // Ẩn badge nếu không có thông báo
    if (unreadCount === 0) {
      badgeElement.style.display = 'none';
    }
  }
}

/**
 * Mở modal đánh giá (sẽ implement sau)
 */
function openEvaluationModal(sessionId) {
  alert(`Mở modal đánh giá cho session ${sessionId}`);
  // TODO: Implement modal đánh giá
}

// Export cho global scope
window.dashboardFunctions = {
  renderSessions,
  createSessionCard,
  formatDate,
  updateNotificationBadge,
  openEvaluationModal
};

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
    
    // 3. Lấy danh sách sessions của student
    const sessionsResponse = await MTP_API.getStudentSessions(currentUser.id);
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
  const contentElement = document.querySelector('.content');
  
  if (!contentElement) {
    console.error('Content element not found');
    return;
  }
  
  // Xóa nội dung cũ (trừ breadcrumb)
  const breadcrumb = contentElement.querySelector('.breadcrumb-back');
  contentElement.innerHTML = '';
  if (breadcrumb) {
    contentElement.appendChild(breadcrumb);
  }
  
  // Nếu không có sessions
  if (!sessions || sessions.length === 0) {
    contentElement.innerHTML += `
      <div style="text-align: center; padding: 40px;">
        <p>Bạn chưa đăng ký buổi học nào.</p>
        <button onclick="location.href='/student/register-session.html'" 
                style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
          Đăng ký buổi học
        </button>
      </div>
    `;
    return;
  }
  
  // Render từng session
  sessions.forEach(session => {
    const sessionCard = createSessionCard(session);
    contentElement.insertAdjacentHTML('beforeend', sessionCard);
  });
}

/**
 * Tạo HTML cho một session card
 */
function createSessionCard(session) {
  return `
    <section class="session-card">
      <div class="session-row">
        <div class="session-icon-box">📅</div>
        <div class="session-main-info">
          <div class="course-name">${session.title}</div>
          <div class="lecturer">${session.tutorName}</div>
        </div>
      </div>
      
      <hr class="session-divider">
      
      <div class="session-row space-between">
        <div class="session-inline">
          <span class="session-small-icon">${session.type === 'online' ? '🔗' : '📍'}</span>
          <span class="session-label">${session.location}</span>
        </div>
        <div class="session-time">${session.startTime} - ${session.endTime}</div>
      </div>
      
      <div class="session-row space-between last-row">
        <div class="session-inline">
          <span class="session-small-icon">📆</span>
          <span class="session-date">${formatDate(session.date)}</span>
        </div>
        
        <button class="rate-btn" onclick="openEvaluationModal(${session.id})">
          <span>Đánh giá</span>
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

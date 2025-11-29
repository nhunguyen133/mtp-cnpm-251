document.addEventListener('DOMContentLoaded', async () => {
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
        window.location.href = '../shared/login.html'; return;
    }

    // Load sessions
    const res = await MTP_API.getTutorCreatedSessions();
    const sessions = res.data || [];
    
    // Update Stats
    document.getElementById('total-sessions').textContent = sessions.length;

    // Render list
    const container = document.getElementById('tutor-session-list');
    container.className = 'tutor-session-list-container';
    
    if(sessions.length === 0) {
        container.innerHTML = '<p>Chưa có lớp học nào.</p>';
    } else {
        container.innerHTML = sessions.map(s => createSessionCard(s)).join('');
    }
});

/**
 * Tạo HTML card cho một session
 */
function createSessionCard(session) {
    // Format date từ YYYY-MM-DD sang DD/MM/YYYY
    const formattedDate = formatDate(session.date);
    
    // Xác định type icon (online/offline)
    const typeIcon = session.location?.toLowerCase().includes('online') || session.type === 'online'
        ? 'link'
        : 'place';
    
    const typeText = session.location?.toLowerCase().includes('online') || session.type === 'online'
        ? 'Online'
        : 'Offline';
    
    return `
        <div class="tutor-session-card">
            <!-- Hàng 1: Icon + Title -->
            <div class="session-title-row">
                <div class="session-icon-box">
                    <span class="material-icons">event</span>
                </div>
                <div class="session-title">${session.subject || session.title}</div>
            </div>

            <hr class="session-divider">
            
            <!-- Hàng 2: Date và Time -->
            <div class="session-info-row">
                <div class="session-info-item">
                    <span class="material-icons">event_available</span>
                    <span class="session-info-text">${formattedDate}</span>
                </div>
                <div class="session-info-item">
                    <span class="material-icons">schedule</span>
                    <span class="session-detail-text">${session.time || session.startTime + ' - ' + session.endTime}</span>
                </div>
            </div>
            
            <!-- Hàng 3: Type và Students Count -->
            <div class="session-info-row">
                <div class="session-info-item">
                    <span class="material-icons">${typeIcon}</span>
                    <span class="session-detail-text">${typeText}</span>
                </div>
                <div class="session-info-item">
                    <span class="material-icons">people_alt</span>
                    <span class="session-detail-text">${session.registeredStudents || session.currentStudents || 0}/${session.maxStudents}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Format date từ YYYY-MM-DD sang DD/MM/YYYY
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
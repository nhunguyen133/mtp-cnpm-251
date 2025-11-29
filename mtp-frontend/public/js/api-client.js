/**
 * MTP API Client - FULL VERSION
 */

const API_BASE_URL = 'http://localhost:3001/api';

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ========== AUTH ==========
async function getCurrentUser() { return apiCall('/auth/me'); }

// ========== TUTOR SCHEDULES (LỊCH TRÌNH) ==========
// Hàm này bị thiếu gây ra lỗi TypeError của bạn
async function getTutorSchedules() {
    return apiCall('/tutor/availability');
}

async function updateTutorSchedule(data) {
    return apiCall('/tutor/availability', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// ========== SESSION (CÁC API KHÁC) ==========
async function getAllSessions() { return apiCall('/sessions'); }
async function getSessionById(id) { return apiCall(`/sessions/${id}`); }
async function getStudentSessions() { return apiCall('/student/my-sessions'); }
async function getAvailableSessions() { return apiCall('/student/sessions'); }
async function registerSession(id) { return apiCall(`/student/sessions/${id}/register`, { method: 'POST' }); }
async function unregisterSession(id) { return apiCall(`/sessions/${id}/register`, { method: 'DELETE' }); }

// ========== TUTOR MANAGEMENT ==========
async function getTutorCreatedSessions() { return apiCall('/tutor/sessions'); }
async function createTutorSession(data) { return apiCall('/tutor/sessions', { method: 'POST', body: JSON.stringify(data) }); }
async function getSessionStudents(id) { return apiCall(`/tutor/sessions/${id}/students`); }
async function deleteTutorSession(id) { return apiCall(`/tutor/sessions/${id}`, { method: 'DELETE' }); }

// ========== NOTIFICATIONS & OTHERS ==========
async function getNotifications() { return apiCall('/notifications'); }

// MEETING MANAGEMENT
async function getTutorMeetings() { return apiCall('/tutor/meetings'); }
async function getMeetingDetail(id) { return apiCall(`/tutor/meetings/${id}`); }
async function updateMeetingStatus(id, status, reason="") { 
    return apiCall(`/tutor/meetings/${id}`, { method: 'PUT', body: JSON.stringify({ status, reason }) }); 
}
async function createNewMeeting(data) { 
    return apiCall('/tutor/meetings', { method: 'POST', body: JSON.stringify(data) }); 
}

// NOTIFICATION SENDING
async function getTutorClasses() { return apiCall('/tutor/classes'); }
async function sendClassNotification(classIds) { 
    return apiCall('/tutor/send-notifications', { method: 'POST', body: JSON.stringify({ classIds }) }); 
}
// Student info
async function getClassStudents(classId) {
    return apiCall(`/tutor/classes/${classId}/students`);
}

async function getStudentInfoByMSSV(mssv) {
    return apiCall(`/student-info/${mssv}`);
}

// EXPORT GLOBAL
window.MTP_API = {
  getCurrentUser,
  // Availability
  getTutorSchedules,
  updateTutorSchedule,
  // Sessions
  getAllSessions,
  getSessionById,
  getStudentSessions,
  getAvailableSessions,
  registerSession,
  unregisterSession,
  // Tutor Ops
  getTutorCreatedSessions,
  createTutorSession,
  getSessionStudents,
  deleteTutorSession,
  // Other
  getNotifications,
  getTutorMeetings,
  getMeetingDetail,
  updateMeetingStatus,
  createNewMeeting,
  getTutorClasses,
  sendClassNotification,
  getClassStudents,
  getStudentInfoByMSSV
};

console.log('✅ MTP API Client loaded successfully');
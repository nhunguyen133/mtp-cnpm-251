/**
 * MTP API Client
 * Module để gọi các API từ Backend
 */

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function để gọi API
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Quan trọng: gửi cookies (session)
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ========== AUTH APIs ==========

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise<{loggedIn: boolean, user?: Object}>}
 */
async function getCurrentUser() {
  return apiCall('/auth/me');
}

// ========== SESSION APIs ==========

/**
 * Lấy danh sách tất cả sessions
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getAllSessions() {
  return apiCall('/sessions');
}

/**
 * Lấy chi tiết một session
 * @param {number} sessionId 
 * @returns {Promise<{success: boolean, data: Object}>}
 */
async function getSessionById(sessionId) {
  return apiCall(`/sessions/${sessionId}`);
}

/**
 * Lấy sessions của student
 * @param {number} studentId 
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getStudentSessions(studentId) {
  return apiCall(`/students/${studentId}/sessions`);
}

/**
 * Đăng ký session
 * @param {number} sessionId 
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
async function registerSession(sessionId) {
  return apiCall(`/sessions/${sessionId}/register`, {
    method: 'POST'
  });
}

/**
 * Hủy đăng ký session
 * @param {number} sessionId 
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function unregisterSession(sessionId) {
  return apiCall(`/sessions/${sessionId}/register`, {
    method: 'DELETE'
  });
}

// ========== TUTOR APIs ==========

/**
 * Lấy danh sách tutors
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getAllTutors() {
  return apiCall('/tutors');
}

/**
 * Lấy thông tin chi tiết tutor
 * @param {number} tutorId 
 * @returns {Promise<{success: boolean, data: Object}>}
 */
async function getTutorById(tutorId) {
  return apiCall(`/tutors/${tutorId}`);
}

/**
 * Lấy lịch rảnh của tutor
 * @param {number} tutorId 
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getTutorAvailability(tutorId) {
  return apiCall(`/tutors/${tutorId}/availability`);
}

// ========== NOTIFICATION APIs ==========

/**
 * Lấy thông báo của user hiện tại
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getNotifications() {
  return apiCall('/notifications');
}

// ========== EVALUATION APIs ==========

/**
 * Lấy đánh giá của session
 * @param {number} sessionId 
 * @returns {Promise<{success: boolean, data: Array}>}
 */
async function getSessionEvaluations(sessionId) {
  return apiCall(`/evaluations/${sessionId}`);
}

// Export tất cả functions
window.MTP_API = {
  // Auth
  getCurrentUser,
  
  // Sessions
  getAllSessions,
  getSessionById,
  getStudentSessions,
  registerSession,
  unregisterSession,
  
  // Tutors
  getAllTutors,
  getTutorById,
  getTutorAvailability,
  
  // Notifications
  getNotifications,
  
  // Evaluations
  getSessionEvaluations
};

console.log('✅ MTP API Client loaded');

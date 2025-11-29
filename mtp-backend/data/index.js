/**
 * Data Aggregator
 * Tập hợp và export tất cả data từ các modules riêng biệt
 */

const users = require('./users');
const sessions = require('./sessions');
const registrations = require('./registrations');
const notifications = require('./notifications');
// const evaluations = require('./evaluations');
const tutorAvailability = require('./tutorAvailability');

// Export all data modules
module.exports = {
    users,
    sessions,
    registrations,
    registeredSessions: registrations, // Alias cho backward compatibility
    notifications,
    // evaluations,
    tutorAvailability
};

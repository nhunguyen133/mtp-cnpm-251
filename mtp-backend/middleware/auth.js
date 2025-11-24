// ============================================
// MIDDLEWARE PHÂN QUYỀN (Authorization)
// ============================================

/**
 * Middleware kiểm tra user đã đăng nhập
 * Sử dụng cho tất cả API cần authentication
 */
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Please login first",
    });
  }
  next();
};

/**
 * Middleware kiểm tra user có role cụ thể
 * @param {string|string[]} roles - Role hoặc mảng các role được phép
 * @returns {Function} Express middleware
 * 
 * Ví dụ:
 * - requireRole('student')           → Chỉ student
 * - requireRole('tutor')             → Chỉ tutor
 * - requireRole(['student', 'tutor']) → Cả student và tutor
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Please login first",
      });
    }

    const userRole = req.session.user.role;
    const rolesArray = allowedRoles.flat(); // Support both single role and array

    if (!rolesArray.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - This action requires one of these roles: ${rolesArray.join(", ")}`,
        userRole: userRole,
      });
    }

    next();
  };
};

/**
 * Middleware kiểm tra user chỉ có thể truy cập data của chính mình
 * (Trừ khi là admin/tutor có quyền xem tất cả)
 */
const requireOwnership = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Please login first",
    });
  }

  const userId = parseInt(req.params.id);
  const currentUserId = req.session.user.id;
  const userRole = req.session.user.role;

  // Admin và tutor có thể xem tất cả
  if (userRole === "admin" || userRole === "tutor") {
    return next();
  }

  // Student chỉ có thể xem data của chính mình
  if (userId !== currentUserId) {
    return res.status(403).json({
      success: false,
      error: "Forbidden - You can only access your own data",
    });
  }

  next();
};

/**
 * Middleware kiểm tra user là chính mình hoặc có role được phép
 * @param {string[]} allowedRoles - Các role được phép (ngoài chính user đó)
 */
const requireOwnershipOrRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Please login first",
      });
    }

    const userId = parseInt(req.params.id);
    const currentUserId = req.session.user.id;
    const userRole = req.session.user.role;
    const rolesArray = allowedRoles.flat();

    // Kiểm tra: là chính mình HOẶC có role được phép
    const isOwner = userId === currentUserId;
    const hasAllowedRole = rolesArray.includes(userRole);

    if (!isOwner && !hasAllowedRole) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - You can only access your own data or need one of these roles: ${rolesArray.join(", ")}`,
      });
    }

    next();
  };
};

// Export tất cả middlewares
module.exports = {
  requireAuth,
  requireRole,
  requireOwnership,
  requireOwnershipOrRole,
};

const jwt = require('../auth/jwt');

/**
 * Role hierarchy for RBAC in Droppii Training OS
 * Higher numbers have more permissions
 */
const ROLE_HIERARCHY = {
  'Member': 1,
  'PSN Leader': 2,
  'Core Leader': 3,
  'Admin': 4
};

/**
 * Extract JWT from Authorization header
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware factory for role-based access control
 * @param {string|string[]} requiredRole - Required role(s)
 * @returns {Function} Express middleware
 */
function requireRole(requiredRole) {
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  return (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        error: 'Thiếu token xác thực',
        code: 'MISSING_AUTH_TOKEN'
      });
    }

    const payload = jwt.verify(token);

    if (!payload) {
      return res.status(401).json({
        error: 'Token không hợp lệ hoặc đã hết hạn',
        code: 'INVALID_TOKEN'
      });
    }

    const userRoleLevel = ROLE_HIERARCHY[payload.role];
    const hasPermission = requiredRoles.some(role => {
      const requiredLevel = ROLE_HIERARCHY[role];
      return userRoleLevel >= requiredLevel;
    });

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Không có quyền truy cập chức năng này',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRoles,
        current: payload.role
      });
    }

    // Attach user info to request
    req.user = payload;
    next();
  };
}

/**
 * Middleware to require authentication only (any valid user)
 */
const requireAuth = requireRole(['Member', 'PSN Leader', 'Core Leader', 'Admin']);

/**
 * Role-specific middleware shortcuts
 */
const requireAdmin = requireRole('Admin');
const requireCoreLeader = requireRole(['Core Leader', 'Admin']);
const requirePSNLeader = requireRole(['PSN Leader', 'Core Leader', 'Admin']);

module.exports = {
  requireRole,
  requireAuth,
  requireAdmin,
  requireCoreLeader,
  requirePSNLeader,
  ROLE_HIERARCHY
};
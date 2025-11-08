export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }
    next();
  };
};

// Helper to authorize multiple roles with OR logic
export const authorizeAnyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.some(role => req.user.role === role)) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }
    next();
  };
};
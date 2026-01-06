const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 */
const AuthCheck = async (req, res, next) => {
  try {
    // Get token from headers / body / query
    const token =
      req.headers['authorization']?.split(' ')[1] ||
      req.headers['x-access-token'] ||
      req.body.token ||
      req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required for authentication"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = { AuthCheck };

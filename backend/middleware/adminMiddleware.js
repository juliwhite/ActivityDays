//const jwt = require('jsonwebtoken');

const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    console.error('Admin Authorization Error:', error);
    res.status(500).json({ message: 'Server error during admin authorization.' });
  }
};

module.exports = authorizeAdmin;
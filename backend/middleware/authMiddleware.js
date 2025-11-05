const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    // If no token 
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    // verifiy token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
      return res.status(403).json({ message: 'Invalid token' });
      }

      // Attack user infor (from JWT payload)
      req.user = decoded; // attach user info to request object
      next();
    });
  } catch(error){
    console.error('Authentication Error', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = authenticateToken;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Example protected route (for testing)
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, this is a protected route.` });
});

router.get('/', (req, res) => {
  res.json({
    message: 'Auth routes',
    routes: [
      { method: 'POST', path: '/api/auth/register', description: 'Register a new user' },
      { method: 'POST', path: '/api/auth/login', description: 'Login and get a token' },
    ],
  });
});

  // Export the router so it can be mounted by the application
  
module.exports = router;
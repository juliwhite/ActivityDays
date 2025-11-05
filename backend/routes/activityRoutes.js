const express = require('express');
const router = express.Router();
const { createActivity, deleteActivity } = require('../controllers/activityController');
const authenticateToken = require( '../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

// Add activity — any authenticated user
router.post('/add', authenticateToken, createActivity);

// Delete activity — only admin or creator
router.delete('/:id', authenticateToken, authorizeAdmin, deleteActivity);

module.exports = router;
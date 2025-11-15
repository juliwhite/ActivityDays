const express = require('express');
const router = express.Router();
const { createActivity, deleteActivity, getActivitiesByCategory } = require('../controllers/activityController');
const authenticateToken = require( '../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

// GET all activities
router.get('/', authenticateToken, getAllActivities);

// GET activities by category
router.get('/category/:category', authenticateToken, getActivitiesByCategory);

// Add activity — any authenticated user
router.post('/', authenticateToken, createActivity);

// Delete activity — only admin or creator
router.delete('/:id', authenticateToken, authorizeAdmin, deleteActivity);

module.exports = router;
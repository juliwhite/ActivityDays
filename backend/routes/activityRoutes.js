const express = require('express');
const router = express.Router();
const { createActivity, deleteActivity, getActivitiesByCategory, updateActivity, getActivityById, rateActivity, getNextUpcomingActivity } = require('../controllers/activityController');
const authenticateToken = require( '../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

// GET all activities
//router.get('/', authenticateToken, getAllActivities);

// GET activities by category
router.get('/category/:category', authenticateToken, getActivitiesByCategory);

// Add activity — ONLY admin
router.post('/', authenticateToken, authorizeAdmin, createActivity);

// Delete activity — ONLY admin or creator
router.delete('/:id', authenticateToken, authorizeAdmin, deleteActivity);

// GET a single activity by ID
router.get('/:id', authenticateToken, authorizeAdmin, getActivityById);

// Update activity — only admin
router.put('/:id', authenticateToken, authorizeAdmin, updateActivity);

router.post('/:id/rate', authenticateToken, rateActivity);

// get recent activities
router.get('/upcoming', getNextUpcomingActivity);


module.exports = router;
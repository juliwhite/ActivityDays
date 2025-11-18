const express = require('express');
const router = express.Router();
const { createActivity, deleteActivity, getActivitiesByCategory, updateActivity } = require('../controllers/activityController');
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

// Update activity — only admin
router.put('/:id', authenticateToken, authorizeAdmin, updateActivity);

module.exports = router;
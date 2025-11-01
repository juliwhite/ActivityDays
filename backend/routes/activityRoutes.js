const express = require('express');
const router = express.Router();
const { createActivity } = require('../controllers/activityController');

router.post('/', createActivity);

module.exports = router;
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMyTimeline } = require('../controllers/timelineController');

const router = express.Router();

router.get('/', protect, getMyTimeline);

module.exports = router;
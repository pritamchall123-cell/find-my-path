const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { list, markOneRead, markAllRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, list);
router.patch('/:id/read', protect, markOneRead);
router.patch('/read-all', protect, markAllRead);

module.exports = router;
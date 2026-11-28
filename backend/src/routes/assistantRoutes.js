const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { chat, streamChat, history, clear } = require('../controllers/assistantController');

const router = express.Router();

router.post('/chat', protect, chat);
router.post('/chat/stream', protect, streamChat);
router.get('/history', protect, history);
router.delete('/history', protect, clear);

module.exports = router;
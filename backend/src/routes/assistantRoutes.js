const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { chat, history } = require('../controllers/assistantController');

const router = express.Router();

router.post('/chat', protect, chat);
router.get('/history', protect, history);

module.exports = router;
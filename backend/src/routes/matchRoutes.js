
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMyMatches } = require('../controllers/matchController');

const router = express.Router();

router.get('/me', protect, getMyMatches);

module.exports = router;
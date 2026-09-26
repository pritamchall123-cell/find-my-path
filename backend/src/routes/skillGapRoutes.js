const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { setTarget, getGap } = require('../controllers/skillGapController');

const router = express.Router();

router.post('/target', protect, setTarget);
router.get('/gap', protect, getGap);

module.exports = router;
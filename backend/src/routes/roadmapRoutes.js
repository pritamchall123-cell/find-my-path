const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { generate, getRoadmap, updateStep } = require('../controllers/roadmapController');

const router = express.Router();

router.post('/generate', protect, generate);
router.get('/me', protect, getRoadmap);
router.patch('/step/:stepId', protect, updateStep);

module.exports = router;
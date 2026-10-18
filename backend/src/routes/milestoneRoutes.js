const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMine } = require('../controllers/milestoneController');

const router = express.Router();

router.get('/', protect, getMine);

module.exports = router;
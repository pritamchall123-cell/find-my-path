const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { create, list, remove, regenerate } = require('../controllers/scenarioController');

const router = express.Router();

router.post('/', protect, create);
router.get('/', protect, list);
router.delete('/:id', protect, remove);
router.post('/:id/regenerate', protect, regenerate);

module.exports = router;
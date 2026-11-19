const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { create, list, update, remove } = require('../controllers/educationController');

const router = express.Router();

router.post('/', protect, create);
router.get('/', protect, list);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

module.exports = router;
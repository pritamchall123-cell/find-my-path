const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { list, toggleSave, listSaved } = require('../controllers/institutionController');

const router = express.Router();

router.get('/', list);
router.get('/saved', protect, listSaved);
router.post('/save', protect, toggleSave);

module.exports = router;
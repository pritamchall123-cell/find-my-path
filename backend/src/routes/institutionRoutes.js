const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { list, toggleSave, listSaved, getOne } = require('../controllers/institutionController');

const router = express.Router();

router.get('/', list);
router.get('/saved', protect, listSaved);
router.post('/save', protect, toggleSave);
router.get('/:id', getOne);

module.exports = router;
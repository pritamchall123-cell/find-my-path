const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { update, changePass, remove } = require('../controllers/userController');

const router = express.Router();

router.put('/account', protect, update);
router.put('/password', protect, changePass);
router.delete('/account', protect, remove);

module.exports = router;
const express = require('express');
const { register, verify, login, googleAuth, forgot, reset } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verify);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgot);
router.post('/reset-password/:token', reset);

module.exports = router;
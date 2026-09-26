const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  listQuestions,
  submit,
  getResults,
} = require('../controllers/assessmentController');

const router = express.Router();

router.get('/questions', listQuestions);
router.post('/submit', protect, submit);
router.get('/results', protect, getResults);

module.exports = router;
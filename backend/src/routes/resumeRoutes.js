
const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { upload, getLatest } = require('../controllers/resumeController');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/upload', protect, uploadMiddleware.single('resume'), upload);
router.get('/latest', protect, getLatest);

module.exports = router;
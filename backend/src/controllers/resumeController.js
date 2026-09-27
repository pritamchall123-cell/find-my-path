const { analyzeResume, getLatestResume } = require('../services/resumeService');

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resume = await analyzeResume(req.user.id, req.file.buffer, req.file.originalname);
    res.status(201).json({ message: 'Resume analyzed', resume });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const getLatest = async (req, res) => {
  try {
    const resume = await getLatestResume(req.user.id);
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { upload, getLatest };
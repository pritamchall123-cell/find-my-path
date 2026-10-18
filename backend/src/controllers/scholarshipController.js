const { getScholarships } = require('../services/scholarshipService');

const list = async (req, res) => {
  try {
    const scholarships = await getScholarships(req.query.educationLevel);
    res.status(200).json({ scholarships });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { list };
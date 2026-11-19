const { getScholarships, getAllStatePortals } = require('../services/scholarshipService');
const { matchScholarships } = require('../services/scholarshipMatchService');

const list = async (req, res) => {
  try {
    const { educationLevel, providerType, state, status } = req.query;
    const scholarships = await getScholarships({ educationLevel, providerType, state, status });
    res.status(200).json({ scholarships });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const listStatePortals = async (req, res) => {
  try {
    const portals = await getAllStatePortals();
    res.status(200).json({ portals });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const findMatches = async (req, res) => {
  try {
    const results = await matchScholarships(req.body);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { list, listStatePortals, findMatches };
const { getQualificationGuides, getGuideByLevel } = require('../services/guideService');

const listAll = async (req, res) => {
  try {
    const sections = await getQualificationGuides();
    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const section = await getGuideByLevel(req.params.level);
    if (!section) {
      return res.status(404).json({ message: 'No guide found for this level' });
    }
    res.status(200).json({ section });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { listAll, getOne };
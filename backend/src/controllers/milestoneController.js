const { getMilestones } = require('../services/milestoneService');

const getMine = async (req, res) => {
  try {
    const result = await getMilestones(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getMine };
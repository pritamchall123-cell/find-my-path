const { setTargetCareer, getSkillGap, getReadinessDashboard } = require('../services/skillGapService');

const setTarget = async (req, res) => {
  try {
    const { careerId } = req.body;
    if (!careerId) {
      return res.status(400).json({ message: 'careerId is required' });
    }
    const profile = await setTargetCareer(req.user.id, careerId);
    res.status(200).json({ message: 'Target career set', profile });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const getGap = async (req, res) => {
  try {
    const result = await getSkillGap(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const getReadiness = async (req, res) => {
  try {
    const result = await getReadinessDashboard(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { setTarget, getGap, getReadiness };
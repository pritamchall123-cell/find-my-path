const {
  generateRoadmap,
  getMyRoadmap,
  updateStepStatus,
} = require('../services/roadmapService');

const generate = async (req, res) => {
  try {
    const roadmap = await generateRoadmap(req.user.id);
    res.status(201).json({ message: 'Roadmap generated', roadmap });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const roadmap = await getMyRoadmap(req.user.id);
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found' });
    }
    res.status(200).json({ roadmap });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateStep = async (req, res) => {
  try {
    const { status } = req.body;
    const roadmap = await updateStepStatus(req.user.id, req.params.stepId, status);
    res.status(200).json({ message: 'Step updated', roadmap });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { generate, getRoadmap, updateStep };
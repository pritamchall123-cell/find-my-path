const { getTimeline } = require('../services/timelineService');

const getMyTimeline = async (req, res) => {
  try {
    const events = await getTimeline(req.user.id);
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getMyTimeline };
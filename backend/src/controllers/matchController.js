const { getMatchesForUser } = require('../services/matchingService');

const getMyMatches = async (req, res) => {
  try {
    const matches = await getMatchesForUser(req.user.id);
    res.status(200).json({ matches });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getMyMatches };
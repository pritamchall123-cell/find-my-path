
const { getProfile, upsertProfile } = require('../services/profileService');

const getMyProfile = async (req, res) => {
  try {
    const profile = await getProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const profile = await upsertProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile saved', profile });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getMyProfile, updateMyProfile };
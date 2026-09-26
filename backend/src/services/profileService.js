const Profile = require('../models/Profile');

const getProfile = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  return profile;
};

const upsertProfile = async (userId, data) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { ...data, user: userId },
    { new: true, upsert: true, runValidators: true }
  );
  return profile;
};

module.exports = { getProfile, upsertProfile };
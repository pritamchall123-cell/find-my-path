const Achievement = require('../models/Achievement');

const ALLOWED_FIELDS = ['title', 'description', 'date', 'category', 'relatedSkill', 'evidenceLink'];

const pickAllowed = (data) => {
  const clean = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) clean[field] = data[field];
  });
  return clean;
};

const createAchievement = async (userId, data) => {
  const achievement = await Achievement.create({ ...pickAllowed(data), user: userId });
  return achievement;
};

const getMyAchievements = async (userId) => {
  const achievements = await Achievement.find({ user: userId }).sort({ date: -1 });
  return achievements;
};

const updateAchievement = async (userId, achievementId, data) => {
  const achievement = await Achievement.findOneAndUpdate(
    { _id: achievementId, user: userId },
    pickAllowed(data),
    { new: true, runValidators: true }
  );
  if (!achievement) {
    const error = new Error('Achievement not found');
    error.statusCode = 404;
    throw error;
  }
  return achievement;
};

const deleteAchievement = async (userId, achievementId) => {
  const achievement = await Achievement.findOneAndDelete({ _id: achievementId, user: userId });
  if (!achievement) {
    const error = new Error('Achievement not found');
    error.statusCode = 404;
    throw error;
  }
  return achievement;
};

module.exports = {
  createAchievement,
  getMyAchievements,
  updateAchievement,
  deleteAchievement,
};
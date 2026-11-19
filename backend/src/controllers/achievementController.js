const mongoose = require('mongoose');
const {
  createAchievement,
  getMyAchievements,
  updateAchievement,
  deleteAchievement,
} = require('../services/achievementService');

const isValidDate = (value) => !isNaN(new Date(value).getTime());

const create = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!date || !isValidDate(date)) {
      return res.status(400).json({ message: 'A valid date is required' });
    }

    const achievement = await createAchievement(req.user.id, req.body);
    res.status(201).json({ message: 'Achievement added', achievement });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const list = async (req, res) => {
  try {
    const achievements = await getMyAchievements(req.user.id);
    res.status(200).json({ achievements });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    if (req.body.title !== undefined && !req.body.title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (req.body.date !== undefined && !isValidDate(req.body.date)) {
      return res.status(400).json({ message: 'A valid date is required' });
    }

    const achievement = await updateAchievement(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: 'Achievement updated', achievement });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    await deleteAchievement(req.user.id, req.params.id);
    res.status(200).json({ message: 'Achievement deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { create, list, update, remove };
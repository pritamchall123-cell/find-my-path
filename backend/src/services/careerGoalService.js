const mongoose = require('mongoose');
const CareerGoal = require('../models/CareerGoal');
const Career = require('../models/Career');
const Profile = require('../models/Profile');

const ALLOWED_FIELDS = ['priority', 'status', 'targetDate', 'motivation', 'notes'];
const CAREER_FIELDS = 'name category sector approxStartingSalary';

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const pickAllowed = (data) => {
  const clean = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) clean[field] = data[field];
  });
  return clean;
};

const createGoal = async (userId, careerId, data) => {
  if (!mongoose.Types.ObjectId.isValid(careerId)) throw httpError('Career not found', 404);

  const career = await Career.findById(careerId).select('_id');
  if (!career) throw httpError('Career not found', 404);

  const fields = pickAllowed(data);
  const existing = await CareerGoal.findOne({ user: userId, career: careerId });

  if (existing) {
    if (existing.status === 'dropped') {
      // Re-adding a dropped career reactivates the old record
      Object.assign(existing, fields);
      if (!fields.status) existing.status = 'exploring';
      existing.isPrimary = false;
      existing.statusChangedAt = new Date();
      await existing.save();
      return existing.populate('career', CAREER_FIELDS);
    }
    throw httpError('You already have a goal for this career', 409);
  }

  const goal = await CareerGoal.create({ ...fields, user: userId, career: careerId });
  return goal.populate('career', CAREER_FIELDS);
};

const getMyGoals = async (userId) => {
  const goals = await CareerGoal.find({ user: userId }).populate('career', CAREER_FIELDS);

  const statusOrder = { active: 0, exploring: 1, paused: 2, achieved: 3, dropped: 4 };
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  goals.sort(
    (a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) ||
      statusOrder[a.status] - statusOrder[b.status] ||
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  return goals;
};

const updateGoal = async (userId, goalId, data) => {
  if (!mongoose.Types.ObjectId.isValid(goalId)) throw httpError('Goal not found', 404);

  const goal = await CareerGoal.findOne({ _id: goalId, user: userId });
  if (!goal) throw httpError('Goal not found', 404);

  const changes = pickAllowed(data);

  if (changes.status && changes.status !== goal.status) {
    if (goal.isPrimary && ['dropped', 'achieved'].includes(changes.status)) {
      throw httpError(
        'This is your primary goal. Make another goal primary first, then change this one.',
        400
      );
    }
    goal.statusChangedAt = new Date();
  }

  Object.assign(goal, changes);
  await goal.save();
  return goal.populate('career', CAREER_FIELDS);
};

const setPrimaryGoal = async (userId, goalId) => {
  if (!mongoose.Types.ObjectId.isValid(goalId)) throw httpError('Goal not found', 404);

  const goal = await CareerGoal.findOne({ _id: goalId, user: userId });
  if (!goal) throw httpError('Goal not found', 404);

  if (['dropped', 'achieved'].includes(goal.status)) {
    throw httpError('Only an exploring, active, or paused goal can be your primary goal.', 400);
  }

  await CareerGoal.updateMany({ user: userId, _id: { $ne: goal._id } }, { isPrimary: false });
  goal.isPrimary = true;
  await goal.save();

  // Keep the existing single-target features (roadmap, skill gap, readiness) working
  await Profile.findOneAndUpdate(
    { user: userId },
    { targetCareer: goal.career },
    { upsert: true }
  );

  return goal.populate('career', CAREER_FIELDS);
};

const deleteGoal = async (userId, goalId) => {
  if (!mongoose.Types.ObjectId.isValid(goalId)) throw httpError('Goal not found', 404);

  const goal = await CareerGoal.findOne({ _id: goalId, user: userId });
  if (!goal) throw httpError('Goal not found', 404);

  if (goal.isPrimary) {
    throw httpError('This is your primary goal. Make another goal primary before deleting it.', 400);
  }

  await goal.deleteOne();
  return goal;
};

module.exports = { createGoal, getMyGoals, updateGoal, setPrimaryGoal, deleteGoal };
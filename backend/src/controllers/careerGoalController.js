const {
  createGoal,
  getMyGoals,
  updateGoal,
  setPrimaryGoal,
  deleteGoal,
} = require('../services/careerGoalService');

const PRIORITIES = ['high', 'medium', 'low'];
const STATUSES = ['exploring', 'active', 'paused', 'achieved', 'dropped'];

// Returns an error message string, or null if the input is fine
const validateGoalInput = (data) => {
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
    return 'Invalid priority';
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    return 'Invalid status';
  }
  if (
    data.targetDate !== undefined &&
    data.targetDate !== null &&
    isNaN(new Date(data.targetDate).getTime())
  ) {
    return 'Invalid target date';
  }
  return null;
};

// An empty date box from the form arrives as '' — treat it as "no date"
const normalize = (body) => {
  const data = { ...body };
  if (data.targetDate === '') data.targetDate = null;
  return data;
};

const handleError = (res, error) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Server error' });
};

const create = async (req, res) => {
  try {
    const data = normalize(req.body);

    if (!data.career) {
      return res.status(400).json({ message: 'A career is required' });
    }
    const problem = validateGoalInput(data);
    if (problem) return res.status(400).json({ message: problem });

    const goal = await createGoal(req.user.id, data.career, data);
    res.status(201).json({ message: 'Goal added', goal });
  } catch (error) {
    handleError(res, error);
  }
};

const list = async (req, res) => {
  try {
    const goals = await getMyGoals(req.user.id);
    res.status(200).json({ goals });
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const data = normalize(req.body);
    const problem = validateGoalInput(data);
    if (problem) return res.status(400).json({ message: problem });

    const goal = await updateGoal(req.user.id, req.params.id, data);
    res.status(200).json({ message: 'Goal updated', goal });
  } catch (error) {
    handleError(res, error);
  }
};

const makePrimary = async (req, res) => {
  try {
    const goal = await setPrimaryGoal(req.user.id, req.params.id);
    res.status(200).json({ message: 'Primary goal updated', goal });
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await deleteGoal(req.user.id, req.params.id);
    res.status(200).json({ message: 'Goal deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { create, list, update, makePrimary, remove };
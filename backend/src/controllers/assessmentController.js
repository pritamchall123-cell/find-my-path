const {
  getAllQuestions,
  submitAssessment,
  getLatestResponse,
} = require('../services/assessmentService');

const listQuestions = async (req, res) => {
  try {
    const educationLevel = req.query.educationLevel;
    const questions = await getAllQuestions(educationLevel);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const submit = async (req, res) => {
  try {
    const { answers, reflections } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    const response = await submitAssessment(req.user.id, answers, reflections);
    res.status(201).json({ message: 'Assessment submitted', response });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getResults = async (req, res) => {
  try {
    const response = await getLatestResponse(req.user.id);
    if (!response) {
      return res.status(404).json({ message: 'No assessment found' });
    }
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { listQuestions, submit, getResults };
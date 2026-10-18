const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentResponse = require('../models/AssessmentResponse');

const getAllQuestions = async (educationLevel) => {
  let filter = {};
  if (educationLevel === 'class10') {
    filter = { forEducationLevel: { $in: ['all', 'class10'] } };
  } else {
    filter = { forEducationLevel: { $ne: 'class10' } };
  }
  const questions = await AssessmentQuestion.find(filter);
  return questions;
};

const submitAssessment = async (userId, answers, reflections) => {
  const response = await AssessmentResponse.create({
    user: userId,
    answers,
    reflections: reflections || {},
  });
  return response;
};

const getLatestResponse = async (userId) => {
  const response = await AssessmentResponse.findOne({ user: userId })
    .sort({ completedAt: -1 })
    .populate('answers.question');
  return response;
};

module.exports = { getAllQuestions, submitAssessment, getLatestResponse };
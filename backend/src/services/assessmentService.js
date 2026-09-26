const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentResponse = require('../models/AssessmentResponse');

const getAllQuestions = async () => {
  const questions = await AssessmentQuestion.find();
  return questions;
};

const submitAssessment = async (userId, answers) => {
  const response = await AssessmentResponse.create({
    user: userId,
    answers,
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
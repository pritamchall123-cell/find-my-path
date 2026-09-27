const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Roadmap = require('../models/Roadmap');
const { getSkillGap } = require('./skillGapService');
const { buildRoadmapPrompt } = require('../prompts/roadmapPrompt');
const { createNotification } = require('./notificationService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRoadmap = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile || !profile.targetCareer) {
    const error = new Error('No target career set. Please set a target career first.');
    error.statusCode = 400;
    throw error;
  }

  const career = await Career.findById(profile.targetCareer);
  const gapResult = await getSkillGap(userId);

  const prompt = buildRoadmapPrompt({
    careerName: career.name,
    educationLevel: profile.academic?.yearOrGrade || 'college',
    gaps: gapResult.gaps,
    entryPaths: career.entryPaths || { streams: [], degrees: [] },
  });

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let steps;
  try {
    steps = JSON.parse(cleaned);
  } catch (err) {
    const error = new Error('Failed to generate roadmap. Please try again.');
    error.statusCode = 500;
    throw error;
  }

  const roadmap = await Roadmap.findOneAndUpdate(
    { user: userId },
    { user: userId, targetCareer: career._id, steps, generatedAt: new Date() },
    { new: true, upsert: true }
  );

  try {
    await createNotification(
      userId,
      `Your roadmap for ${career.name} is ready! Check out your first steps.`,
      'roadmap'
    );
  } catch (err) {
    // notification failure shouldn't break roadmap generation
  }

  return roadmap;
};

const getMyRoadmap = async (userId) => {
  const roadmap = await Roadmap.findOne({ user: userId }).populate('targetCareer', 'name');
  return roadmap;
};

const updateStepStatus = async (userId, stepId, status) => {
  const roadmap = await Roadmap.findOne({ user: userId });
  if (!roadmap) {
    const error = new Error('No roadmap found');
    error.statusCode = 404;
    throw error;
  }

  const step = roadmap.steps.id(stepId);
  if (!step) {
    const error = new Error('Step not found');
    error.statusCode = 404;
    throw error;
  }

  step.status = status;
  await roadmap.save();

  if (status === 'completed') {
    try {
      await createNotification(userId, `Great work! You completed: ${step.title}`, 'step');
    } catch (err) {
      // ignore
    }
  }

  return roadmap;
};

module.exports = { generateRoadmap, getMyRoadmap, updateStepStatus };
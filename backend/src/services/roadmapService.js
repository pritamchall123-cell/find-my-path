const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Roadmap = require('../models/Roadmap');
const { getSkillGap } = require('./skillGapService');
const { buildRoadmapPrompt } = require('../prompts/roadmapPrompt');
const { createNotification } = require('./notificationService');
const retryGroq = require('../utils/retryGroq');

// Main model first, backup second
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const callGroqModel = async (model, prompt) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = new Error(`Groq ${model} ${res.status}: ${await res.text()}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

const generateText = async (prompt) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set');
    const e = new Error('AI service is not configured.');
    e.statusCode = 500;
    throw e;
  }

  for (const model of GROQ_MODELS) {
    try {
      return await retryGroq(() => callGroqModel(model, prompt));
    } catch (err) {
      console.error(`Groq model ${model} failed:`, err.message);
    }
  }

  const e = new Error('AI is busy right now, please try again in a minute.');
  e.statusCode = 503;
  throw e;
};

const extractJson = (raw) => {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const starts = [cleaned.indexOf('['), cleaned.indexOf('{')].filter((i) => i >= 0);
  const start = starts.length ? Math.min(...starts) : -1;
  const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
};

const generateRoadmap = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile || !profile.targetCareer) {
    const error = new Error('No target career set. Please set a target career first.');
    error.statusCode = 400;
    throw error;
  }

  const career = await Career.findById(profile.targetCareer);
  if (!career) {
    const error = new Error('Target career not found. Please select a career again.');
    error.statusCode = 404;
    throw error;
  }

  const gapResult = await getSkillGap(userId);

  const prompt = buildRoadmapPrompt({
    careerName: career.name,
    educationLevel: profile.academic?.yearOrGrade || 'college',
    gaps: gapResult.gaps,
    entryPaths: career.entryPaths || { streams: [], degrees: [] },
  });

  const raw = await generateText(prompt);

  let steps;
  try {
    steps = JSON.parse(extractJson(raw));
  } catch (err) {
    console.error('Roadmap JSON parse failed. Raw output:', raw);
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
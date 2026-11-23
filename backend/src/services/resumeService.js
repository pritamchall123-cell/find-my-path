const { PDFParse } = require('pdf-parse');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Resume = require('../models/Resume');
const { buildResumeAnalysisPrompt } = require('../prompts/resumeAnalysisPrompt');
const { generateText, extractJson } = require('../utils/groq');

const MAX_RESUME_CHARS = 8000; // keeps the request small enough for Groq's free limits

const analyzeResume = async (userId, fileBuffer, fileName) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile || !profile.targetCareer) {
    const error = new Error('Please set a target career before analyzing your resume.');
    error.statusCode = 400;
    throw error;
  }

  const career = await Career.findById(profile.targetCareer).populate('coreSkills.skill', 'name');
  const requiredSkills = career.coreSkills.filter((cs) => cs.skill).map((cs) => cs.skill.name);

  const parser = new PDFParse({ data: fileBuffer });
  let resumeText;
  try {
    const result = await parser.getText();
    resumeText = result.text;
  } finally {
    await parser.destroy();
  }

  const prompt = buildResumeAnalysisPrompt({
    resumeText: resumeText.slice(0, MAX_RESUME_CHARS),
    careerName: career.name,
    requiredSkills,
  });

  const raw = await generateText(prompt);

  let analysis;
  try {
    analysis = JSON.parse(extractJson(raw));
  } catch (err) {
    console.error('Resume analysis JSON parse failed. Raw output:', raw);
    const error = new Error('Failed to analyze resume. Please try again.');
    error.statusCode = 500;
    throw error;
  }

  const resume = await Resume.create({
    user: userId,
    fileName,
    extractedText: resumeText,
    analysis,
  });

  return resume;
};

const getLatestResume = async (userId) => {
  const resume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
  return resume;
};

module.exports = { analyzeResume, getLatestResume };
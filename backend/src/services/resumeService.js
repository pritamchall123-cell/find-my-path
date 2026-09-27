
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Resume = require('../models/Resume');
const { buildResumeAnalysisPrompt } = require('../prompts/resumeAnalysisPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (userId, fileBuffer, fileName) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile || !profile.targetCareer) {
    const error = new Error('Please set a target career before analyzing your resume.');
    error.statusCode = 400;
    throw error;
  }

  const career = await Career.findById(profile.targetCareer).populate('coreSkills.skill', 'name');
  const requiredSkills = career.coreSkills.filter((cs) => cs.skill).map((cs) => cs.skill.name);

  const pdfData = await pdfParse(fileBuffer);
  const resumeText = pdfData.text;

  const prompt = buildResumeAnalysisPrompt({
    resumeText,
    careerName: career.name,
    requiredSkills,
  });

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let analysis;
  try {
    analysis = JSON.parse(cleaned);
  } catch (err) {
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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildCareerExplanationPrompt } = require('../prompts/careerExplanationPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const retryGemini = require('../utils/retryGemini');

const explainMatches = async (matches) => {
  const prompt = buildCareerExplanationPrompt(matches);

  const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
  const result = await retryGemini(() => model.generateContent(prompt));
  const raw = result.response.text();

  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return [];
  }
};

module.exports = { explainMatches };
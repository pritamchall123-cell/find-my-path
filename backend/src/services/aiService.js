const { buildCareerExplanationPrompt } = require('../prompts/careerExplanationPrompt');
const { generateText, extractJson } = require('../utils/groq');

const explainMatches = async (matches) => {
  const prompt = buildCareerExplanationPrompt(matches);
  const raw = await generateText(prompt);

  try {
    return JSON.parse(extractJson(raw));
  } catch (err) {
    console.error('Career explanation JSON parse failed. Raw output:', raw);
    return [];
  }
};

module.exports = { explainMatches };
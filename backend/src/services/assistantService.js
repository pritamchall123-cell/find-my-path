
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Roadmap = require('../models/Roadmap');
const Conversation = require('../models/Conversation');
const { getSkillGap } = require('./skillGapService');
const { buildAssistantContext } = require('../prompts/careerAssistantPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (userId, userMessage) => {
  const profile = await Profile.findOne({ user: userId });

  let targetCareerName = null;
  if (profile?.targetCareer) {
    const career = await Career.findById(profile.targetCareer);
    targetCareerName = career ? career.name : null;
  }

  let skillGap = null;
  if (profile?.targetCareer) {
    try {
      skillGap = await getSkillGap(userId);
    } catch (err) {
      skillGap = null;
    }
  }

  const roadmap = await Roadmap.findOne({ user: userId });

  const context = buildAssistantContext({ profile, targetCareerName, skillGap, roadmap });

  let conversation = await Conversation.findOne({ user: userId });
  if (!conversation) {
    conversation = new Conversation({ user: userId, messages: [] });
  }

  const historyText = conversation.messages
    .slice(-10)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const fullPrompt = `${context}\n\nCONVERSATION HISTORY:\n${historyText}\n\nStudent's new message: ${userMessage}\n\nRespond as the assistant, in plain conversational text (not JSON).`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(fullPrompt);
  const aiReply = result.response.text();

  conversation.messages.push({ role: 'user', content: userMessage });
  conversation.messages.push({ role: 'assistant', content: aiReply });
  await conversation.save();

  return aiReply;
};

const getHistory = async (userId) => {
  const conversation = await Conversation.findOne({ user: userId });
  return conversation ? conversation.messages : [];
};

module.exports = { sendMessage, getHistory };
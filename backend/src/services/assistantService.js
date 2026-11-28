const User = require('../models/User');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Roadmap = require('../models/Roadmap');
const Conversation = require('../models/Conversation');
const AssessmentResponse = require('../models/AssessmentResponse');
const { getSkillGap } = require('./skillGapService');
const { findColleges } = require('./assistantDataService');
const { findScholarships } = require('./ScholarshipSearchService');
const { buildAssistantContext } = require('../prompts/careerAssistantPrompt');
const { generateText, streamText } = require('../utils/groq');

const ANSWER_RULES = `HOW TO ANSWER:
- Start with a direct answer in 1 or 2 sentences.
- Keep it under 150 words unless the student asks for more detail.
- Use simple English and short paragraphs.
- Use bullet points for lists, with at most 5 bullets.
- Do not use tables, headings, horizontal lines or emojis.
- Do not state college or scholarship facilities, fees, rankings, cutoffs, amounts or dates unless they are given above. Tell the student to check the official website.
- End with at most one short follow-up question.
- Reply in Markdown text, not JSON.`;

const buildCollegeBlock = (data) => {
  if (!data) return '';

  return `

COLLEGE DATA FROM FINDMYPATH (matched by: ${data.matchedBy}, total found: ${data.totalFound}):
${JSON.stringify(data.colleges)}

RULES FOR COLLEGE DATA:
- Use it only if the student is asking about colleges.
- Mention only colleges from this list, at most 3.
- Do not call any college the "best". Say why it may fit.
- If "matched by" says NOT matched, clearly say the results are not filtered for that.
- If a college is unverified, say its details need checking on the official website.
- If the list is empty, say FindMyPath has no matching college yet and suggest the Find Colleges page.`;
};

const buildScholarshipBlock = (data) => {
  if (!data) return '';

  return `

SCHOLARSHIP DATA FROM FINDMYPATH (matched by: ${data.matchedBy}, total found: ${data.totalFound}):
${JSON.stringify(data.scholarships)}

RULES FOR SCHOLARSHIP DATA:
- Use it only if the student is asking about scholarships.
- Mention only scholarships from this list, at most 3.
- Never say the student is eligible. Say it "may match" and list what to check.
- Say each scholarship's status. Only call it open if its status is "open", and ask the student to confirm on the official site.
- If the state is "not given", ask which state the student is from.
- Share only links given in the data.
- If the list is empty, say FindMyPath has no matching scholarship yet and suggest the Scholarships page.`;
};

// A failed search should not stop the chat
const safeSearch = async (label, search) => {
  try {
    return await search();
  } catch (err) {
    console.error(`${label} search failed:`, err.message);
    return null;
  }
};

// Collects the student's data and builds the full prompt
const preparePrompt = async (userId, userMessage) => {
  const user = await User.findById(userId).select('educationLevel');
  const profile = await Profile.findOne({ user: userId });

  let targetCareer = null;
  if (profile?.targetCareer) {
    targetCareer = await Career.findById(profile.targetCareer);
  }
  const targetCareerName = targetCareer ? targetCareer.name : null;

  let skillGap = null;
  if (profile?.targetCareer) {
    try {
      skillGap = await getSkillGap(userId);
    } catch (err) {
      skillGap = null;
    }
  }

  const roadmap = await Roadmap.findOne({ user: userId });

  const latestAssessment = await AssessmentResponse.findOne({ user: userId }).sort({ completedAt: -1 });
  const reflections = latestAssessment?.reflections || null;

  const context = buildAssistantContext({ profile, targetCareerName, skillGap, roadmap, reflections });
  const levelLine = user?.educationLevel
    ? `Education level at signup: ${user.educationLevel}\n`
    : '';

  let conversation = await Conversation.findOne({ user: userId });
  if (!conversation) {
    conversation = new Conversation({ user: userId, messages: [] });
  }

  // Search using the previous and the new question, to handle follow-ups
  const previousQuestion =
    [...conversation.messages].reverse().find((m) => m.role === 'user')?.content || '';
  const searchText = `${previousQuestion} ${userMessage}`;

  const collegeData = await safeSearch('College', () =>
    findColleges(searchText, targetCareer?.eligibleDegrees || [])
  );
  const scholarshipData = await safeSearch('Scholarship', () =>
    findScholarships(searchText, user?.educationLevel)
  );

  // Last 6 messages, each cut to 600 characters, to save tokens
  const historyText = conversation.messages
    .slice(-6)
    .map((m) => `${m.role}: ${m.content.slice(0, 600)}`)
    .join('\n');

  const fullPrompt = `${context}${levelLine}${buildCollegeBlock(collegeData)}${buildScholarshipBlock(scholarshipData)}\n\nCONVERSATION HISTORY:\n${historyText}\n\nStudent's new message: ${userMessage}\n\n${ANSWER_RULES}`;

  return { conversation, fullPrompt };
};

const saveExchange = async (conversation, userMessage, reply) => {
  conversation.messages.push({ role: 'user', content: userMessage });
  conversation.messages.push({ role: 'assistant', content: reply });
  await conversation.save();
};

const sendMessage = async (userId, userMessage) => {
  const { conversation, fullPrompt } = await preparePrompt(userId, userMessage);
  const reply = await generateText(fullPrompt, 0.4);
  await saveExchange(conversation, userMessage, reply);
  return reply;
};

const streamMessage = async (userId, userMessage, onChunk, signal) => {
  const { conversation, fullPrompt } = await preparePrompt(userId, userMessage);
  const reply = await streamText(fullPrompt, 0.4, onChunk, signal);
  await saveExchange(conversation, userMessage, reply);
};

const getHistory = async (userId) => {
  const conversation = await Conversation.findOne({ user: userId });
  return conversation ? conversation.messages : [];
};

const clearHistory = async (userId) => {
  await Conversation.deleteOne({ user: userId });
};

module.exports = { sendMessage, streamMessage, getHistory, clearHistory };
const Career = require('../models/Career');
const AssessmentResponse = require('../models/AssessmentResponse');

const getUserAnswerMap = async (userId) => {
  const response = await AssessmentResponse.findOne({ user: userId })
    .sort({ completedAt: -1 })
    .populate('answers.question');

  if (!response) return null;

  const map = {};
  response.answers.forEach((a) => {
    if (a.question && a.question.tag) {
      map[a.question.tag] = Number(a.selectedValue);
    }
  });
  return map;
};

const scoreCareerForUser = (career, answerMap) => {
  let totalWeight = 0;
  let earnedScore = 0;
  const breakdown = [];
  let passionGapSkill = null;

  career.coreSkills.forEach(({ skill, weight }) => {
    if (!skill) return;
    const skillTag = skill.category || skill.name.toLowerCase();
    const userScore = answerMap[skillTag] ?? 3;

    totalWeight += weight;
    earnedScore += (userScore / 5) * weight;

    const status = userScore >= 4 ? 'strong' : userScore === 3 ? 'moderate' : 'gap';

    breakdown.push({
      skill: skill.name,
      weight,
      userScore,
      status,
    });

    // Detect interest-vs-skill tension: the same category might appear as both
    // an "interest" question tag and a "skillConfidence" question tag. If the
    // interest-style score is high but this specific skill's score is low,
    // flag it — this is the "drawn to it, not there yet" pattern.
    const interestScore = answerMap[skillTag];
    if (interestScore >= 4 && userScore <= 2 && !passionGapSkill) {
      passionGapSkill = skill.name;
    }
  });

  const compatibility = totalWeight > 0
    ? Math.round((earnedScore / totalWeight) * 100)
    : 0;

  return { compatibility, breakdown, passionGapSkill };
};

const getMatchesForUser = async (userId) => {
  const answerMap = await getUserAnswerMap(userId);
  if (!answerMap) {
    const error = new Error('No assessment found for this user. Please complete the assessment first.');
    error.statusCode = 400;
    throw error;
  }

  const careers = await Career.find().populate('coreSkills.skill', 'name category');

  const scored = careers.map((career) => {
    const { compatibility, breakdown, passionGapSkill } = scoreCareerForUser(career, answerMap);
    return {
      careerId: career._id,
      name: career.name,
      category: career.category,
      compatibility,
      breakdown,
      passionGapSkill,
    };
  });

  scored.sort((a, b) => b.compatibility - a.compatibility);

  return scored;
};

module.exports = { getMatchesForUser };
const Profile = require('../models/Profile');
const Career = require('../models/Career');

const setTargetCareer = async (userId, careerId) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { targetCareer: careerId },
    { new: true, upsert: true }
  );
  return profile;
};

const getSkillGap = async (userId) => {
  const profile = await Profile.findOne({ user: userId });
  if (!profile || !profile.targetCareer) {
    const error = new Error('No target career set. Please set a target career first.');
    error.statusCode = 400;
    throw error;
  }

  const career = await Career.findById(profile.targetCareer)
    .populate('coreSkills.skill', 'name category')
    .populate('optionalSkills', 'name category');

  if (!career) {
    const error = new Error('Target career not found');
    error.statusCode = 404;
    throw error;
  }

  const userSkillMap = {};
  (profile.skills || []).forEach((s) => {
    userSkillMap[s.name.toLowerCase()] = s.confidence;
  });

  const buildGapEntry = (skillName, category, weight, required) => {
    const userConfidence = userSkillMap[skillName.toLowerCase()] || 0;
    const readiness = Math.round((userConfidence / 5) * 100);
    return {
      skill: skillName,
      category: category || 'general',
      required,
      weight: weight || null,
      userConfidence,
      readiness,
      gap: 100 - readiness,
    };
  };

  const coreGaps = career.coreSkills
    .filter((cs) => cs.skill)
    .map((cs) => buildGapEntry(cs.skill.name, cs.skill.category, cs.weight, true));

  const optionalGaps = career.optionalSkills
    .filter((s) => s)
    .map((s) => buildGapEntry(s.name, s.category, null, false));

  const allGaps = [...coreGaps, ...optionalGaps].sort((a, b) => b.gap - a.gap);

  return {
    career: career.name,
    gaps: allGaps,
  };
};

const getReadinessDashboard = async (userId) => {
  const { career, gaps } = await getSkillGap(userId);

  const categoryMap = {};
  gaps.forEach((g) => {
    if (!categoryMap[g.category]) {
      categoryMap[g.category] = { total: 0, count: 0 };
    }
    categoryMap[g.category].total += g.readiness;
    categoryMap[g.category].count += 1;
  });

  const categories = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    readiness: Math.round(data.total / data.count),
  }));

  const overallReadiness = gaps.length > 0
    ? Math.round(gaps.reduce((sum, g) => sum + g.readiness, 0) / gaps.length)
    : 0;

  return {
    career,
    overallReadiness,
    categories,
  };
};

module.exports = { setTargetCareer, getSkillGap, getReadinessDashboard };
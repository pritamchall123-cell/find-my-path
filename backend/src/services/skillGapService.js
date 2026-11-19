const Profile = require('../models/Profile');
const Career = require('../models/Career');
const Portfolio = require('../models/Portfolio');
const CareerGoal = require('../models/CareerGoal');
const { createGoal, updateGoal, setPrimaryGoal } = require('./careerGoalService');

const setTargetCareer = async (userId, careerId) => {
  let goal = await CareerGoal.findOne({ user: userId, career: careerId });

  if (!goal || goal.status === 'dropped') {
    // New goal, or a dropped one coming back (createGoal reactivates it)
    goal = await createGoal(userId, careerId, { status: 'active' });
  } else if (goal.status !== 'active') {
    // Choosing it as your target means you're actively working toward it
    goal = await updateGoal(userId, goal._id, { status: 'active' });
  }

  // Marks it primary and syncs Profile.targetCareer
  await setPrimaryGoal(userId, goal._id);

  const profile = await Profile.findOne({ user: userId });
  return profile;
};

const determineStatus = (skillName, userConfidence, portfolioEntries) => {
  const skillLower = skillName.toLowerCase();

  const completedEvidence = portfolioEntries.filter(
    (e) =>
      e.status === 'completed' &&
      e.skillsDemonstrated.some((s) => s.toLowerCase() === skillLower)
  );
  if (completedEvidence.length > 0) {
    return { status: 'completed', evidence: completedEvidence };
  }

  const inProgressEvidence = portfolioEntries.filter(
    (e) =>
      e.status === 'in_progress' &&
      e.skillsDemonstrated.some((s) => s.toLowerCase() === skillLower)
  );
  if (inProgressEvidence.length > 0) {
    return { status: 'in_progress', evidence: inProgressEvidence };
  }

  if (userConfidence > 0) {
    return { status: 'self_reported', evidence: [] };
  }

  return { status: 'not_started', evidence: [] };
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

  const portfolioEntries = await Portfolio.find({ user: userId }).lean();

  const buildGapEntry = (skillName, category, weight, required) => {
    const userConfidence = userSkillMap[skillName.toLowerCase()] || 0;
    const readiness = Math.round((userConfidence / 5) * 100);
    const { status, evidence } = determineStatus(skillName, userConfidence, portfolioEntries);

    return {
      skill: skillName,
      category: category || 'general',
      required,
      weight: weight || null,
      userConfidence,
      readiness,
      gap: 100 - readiness,
      status,
      evidence: evidence.map((e) => ({ id: e._id, title: e.title, links: e.links })),
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
    methodology:
      'Readiness is calculated from your self-rated skill confidence (1-5), converted to a percentage. A skill marked "completed" has at least one finished portfolio entry as evidence; "in progress" has an active entry; "self-reported" means you rated it but have no portfolio evidence yet; "not started" means no rating or evidence exists. This reflects your own input, not an independent assessment of actual competence — treat it as a planning tool, not a certification.',
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

const toggleSavedCareer = async (userId, careerId) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    {},
    { new: true, upsert: true }
  );

  const alreadySaved = profile.savedCareers.some((id) => id.toString() === careerId);

  if (alreadySaved) {
    profile.savedCareers = profile.savedCareers.filter((id) => id.toString() !== careerId);
  } else {
    profile.savedCareers.push(careerId);
  }

  await profile.save();
  return { saved: !alreadySaved, savedCareers: profile.savedCareers };
};

const getSavedCareers = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate(
    'savedCareers',
    'name category description sector'
  );
  return profile?.savedCareers || [];
};

module.exports = {
  setTargetCareer,
  getSkillGap,
  getReadinessDashboard,
  toggleSavedCareer,
  getSavedCareers,
};
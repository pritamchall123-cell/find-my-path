const User = require('../models/User');

const safeModel = (file) => {
  try {
    return require(`../models/${file}`);
  } catch (e) {
    return null;
  }
};

const Career = safeModel('Career');
const Institution = safeModel('Institution');
const Scholarship = safeModel('Scholarship');
const GuideSection = safeModel('GuideSection');
const AssessmentResponse = safeModel('AssessmentResponse');
const Roadmap = safeModel('Roadmap');
const Resume = safeModel('Resume');
const Portfolio = safeModel('Portfolio');
const CareerGoal = safeModel('CareerGoal');

const count = async (Model, filter = {}) => (Model ? Model.countDocuments(filter) : null);

const dayKey = (date) => date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

const getAdminStats = async () => {
  const now = Date.now();
  const d7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const d30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers, newUsers7, newUsers30, verifiedUsers, adminUsers,
    educationBreakdown, signupRows, recentUsers,
    careers, colleges, scholarships, guides,
    assessments, roadmaps, resumes, portfolios, goals,
    collegesUnverified, collegesNoImage, collegesNoCoords,
    scholarshipsUnverified,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: d7 } }),
    User.countDocuments({ createdAt: { $gte: d30 } }),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ role: 'admin' }),
    User.aggregate([{ $group: { _id: '$educationLevel', count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { createdAt: { $gte: d30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
          count: { $sum: 1 },
        },
      },
    ]),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email educationLevel role isVerified createdAt')
      .lean(),
    count(Career),
    count(Institution),
    count(Scholarship),
    count(GuideSection),
    count(AssessmentResponse),
    count(Roadmap),
    count(Resume),
    count(Portfolio),
    count(CareerGoal),
    count(Institution, { 'dataProvenance.verificationStatus': 'unverified' }),
    count(Institution, { $or: [{ imageUrl: '' }, { imageUrl: null }, { imageUrl: { $exists: false } }] }),
    count(Institution, { $or: [{ 'location.coordinates.lat': null }, { 'location.coordinates.lng': null }] }),
    count(Scholarship, { applicationStatus: 'unverified' }),
  ]);

  const byDay = Object.fromEntries(signupRows.map((r) => [r._id, r.count]));
  const signupsByDay = [];
  for (let i = 29; i >= 0; i--) {
    const key = dayKey(new Date(now - i * 24 * 60 * 60 * 1000));
    signupsByDay.push({ date: key, count: byDay[key] || 0 });
  }

  return {
    users: {
      total: totalUsers,
      last7Days: newUsers7,
      last30Days: newUsers30,
      verified: verifiedUsers,
      admins: adminUsers,
      byEducationLevel: educationBreakdown.map((e) => ({
        level: e._id || 'not set',
        count: e.count,
      })),
    },
    content: { careers, colleges, scholarships, guides },
    usage: { assessments, roadmaps, resumes, portfolios, goals },
    dataQuality: {
      collegesUnverified,
      collegesNoImage,
      collegesNoCoords,
      scholarshipsUnverified,
    },
    signupsByDay,
    recentUsers,
  };
};

module.exports = { getAdminStats };
const GuideSection = require('../models/GuideSection');

const getQualificationGuides = async () => {
  const sections = await GuideSection.find({ type: 'qualification' }).sort({ order: 1 });
  return sections;
};

const getGuideByLevel = async (level) => {
  const section = await GuideSection.findOne({ type: 'qualification', level });
  return section;
};

module.exports = { getQualificationGuides, getGuideByLevel };
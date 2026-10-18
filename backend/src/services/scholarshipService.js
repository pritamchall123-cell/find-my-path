const Scholarship = require('../models/Scholarship');

const getScholarships = async (educationLevel) => {
  let filter = {};
  if (educationLevel) {
    filter = { eligibleEducationLevels: educationLevel };
  }
  const scholarships = await Scholarship.find(filter).sort({ name: 1 });
  return scholarships;
};

module.exports = { getScholarships };
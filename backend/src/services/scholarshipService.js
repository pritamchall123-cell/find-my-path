const Scholarship = require('../models/Scholarship');
const StatePortal = require('../models/StatePortal');

const getScholarships = async ({ educationLevel, providerType, state, status }) => {
  const filter = {};

  if (educationLevel) filter.educationLevels = educationLevel;
  if (providerType) filter.providerType = providerType;
  if (status) filter.applicationStatus = status;
  if (state) {
    filter.$or = [
      { eligibleStates: { $regex: state, $options: 'i' } },
      { eligibleStates: 'All India' },
    ];
  }

  const scholarships = await Scholarship.find(filter).sort({ applicationStatus: 1, name: 1 });
  return scholarships;
};

const getAllStatePortals = async () => {
  const portals = await StatePortal.find().sort({ stateOrUT: 1 });
  return portals;
};

module.exports = { getScholarships, getAllStatePortals };
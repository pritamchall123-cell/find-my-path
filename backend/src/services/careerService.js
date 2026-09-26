const Career = require('../models/Career');

const getAllCareers = async () => {
  const careers = await Career.find().select(
    'name category description entryLevelRoles'
  );
  return careers;
};

const getCareerById = async (id) => {
  const career = await Career.findById(id)
    .populate('coreSkills.skill', 'name category')
    .populate('optionalSkills', 'name category')
    .populate('relatedCareers', 'name category');
  return career;
};

module.exports = { getAllCareers, getCareerById };
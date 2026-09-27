const Career = require('../models/Career');

const getAllCareers = async () => {
  const careers = await Career.find().select('name category description entryLevelRoles');
  return careers;
};

const getCareerById = async (id) => {
  const career = await Career.findById(id)
    .populate('coreSkills.skill', 'name category')
    .populate('optionalSkills', 'name category')
    .populate('relatedCareers', 'name category');
  return career;
};

const createCareer = async (data) => {
  const career = await Career.create(data);
  return career;
};

const updateCareer = async (id, data) => {
  const career = await Career.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!career) {
    const error = new Error('Career not found');
    error.statusCode = 404;
    throw error;
  }
  return career;
};

const deleteCareer = async (id) => {
  const career = await Career.findByIdAndDelete(id);
  if (!career) {
    const error = new Error('Career not found');
    error.statusCode = 404;
    throw error;
  }
  return career;
};

module.exports = { getAllCareers, getCareerById, createCareer, updateCareer, deleteCareer };
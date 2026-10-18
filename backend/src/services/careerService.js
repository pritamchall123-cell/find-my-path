const Career = require('../models/Career');

const getAllCareers = async () => {
  const careers = await Career.find().select('name category description entryLevelRoles sector');
  return careers;
};

const getCareerById = async (id) => {
  const career = await Career.findById(id)
    .populate('coreSkills.skill', 'name category')
    .populate('optionalSkills', 'name category')
    .populate('relatedCareers', 'name category');
  return career;
};

const getCareersByDegree = async (degree) => {
  const careers = await Career.find({
    $or: [
      { eligibleDegrees: { $regex: degree, $options: 'i' } },
      { eligibleDegrees: 'Any Graduate' },
    ],
  }).select('name category description sector examRequired approxStartingSalary careerGrowth entryLevelRoles');

  const government = careers.filter((c) => c.sector === 'government' || c.sector === 'both');
  const privateSector = careers.filter((c) => c.sector === 'private' || c.sector === 'both');

  return { government, private: privateSector };
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

module.exports = {
  getAllCareers,
  getCareerById,
  getCareersByDegree,
  createCareer,
  updateCareer,
  deleteCareer,
};
const { getAllCareers, getCareerById } = require('../services/careerService');

const listCareers = async (req, res) => {
  try {
    const careers = await getAllCareers();
    res.status(200).json({ careers });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getCareer = async (req, res) => {
  try {
    const career = await getCareerById(req.params.id);
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    res.status(200).json({ career });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { listCareers, getCareer };
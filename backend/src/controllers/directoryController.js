const { getAllSectors, getSectorBySlug } = require('../services/directoryService');

const listSectors = async (req, res) => {
  try {
    const sectors = await getAllSectors();
    res.status(200).json({ sectors });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getSector = async (req, res) => {
  try {
    const result = await getSectorBySlug(req.params.slug);
    if (!result) {
      return res.status(404).json({ message: 'Sector not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { listSectors, getSector };
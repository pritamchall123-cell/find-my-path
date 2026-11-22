const {
  getInstitutions,
  getInstitutionById,
  toggleSavedInstitution,
  getSavedInstitutions,
} = require('../services/institutionService');

const list = async (req, res) => {
  try {
    const { degree, city, state, name, type, pincode, lat, lng, maxDistanceKm } = req.query;
    const institutions = await getInstitutions({
      degree, city, state, name, type, pincode, lat, lng, maxDistanceKm,
    });
    res.status(200).json({ institutions });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const toggleSave = async (req, res) => {
  try {
    const { institutionId } = req.body;
    if (!institutionId) {
      return res.status(400).json({ message: 'institutionId is required' });
    }
    const result = await toggleSavedInstitution(req.user.id, institutionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const listSaved = async (req, res) => {
  try {
    const savedInstitutions = await getSavedInstitutions(req.user.id);
    res.status(200).json({ savedInstitutions });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const institution = await getInstitutionById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    res.status(200).json({ institution });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { list, toggleSave, listSaved, getOne };
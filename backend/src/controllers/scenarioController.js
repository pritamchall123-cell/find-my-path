const {
  createScenario,
  getMyScenarios,
  deleteScenario,
  regenerateScenario,
} = require('../services/scenarioService');

const create = async (req, res) => {
  try {
    const { name, currentQualification, targetCareer, preferredLocation, maxBudgetPerYear } = req.body;

    if (!currentQualification || !targetCareer) {
      return res.status(400).json({ message: 'Current qualification and target career are required' });
    }

    const scenario = await createScenario(
      req.user.id,
      { currentQualification, targetCareer, preferredLocation, maxBudgetPerYear },
      name
    );
    res.status(201).json({ message: 'Scenario created', scenario });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const list = async (req, res) => {
  try {
    const scenarios = await getMyScenarios(req.user.id);
    res.status(200).json({ scenarios });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await deleteScenario(req.user.id, req.params.id);
    res.status(200).json({ message: 'Scenario deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const regenerate = async (req, res) => {
  try {
    const scenario = await regenerateScenario(req.user.id, req.params.id);
    res.status(200).json({ message: 'Scenario regenerated', scenario });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { create, list, remove, regenerate };
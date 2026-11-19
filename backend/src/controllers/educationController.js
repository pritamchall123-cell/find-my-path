const { createRecord, getMyRecords, updateRecord, deleteRecord } = require('../services/educationService');

const create = async (req, res) => {
  try {
    if (!req.body.educationLevel) {
      return res.status(400).json({ message: 'educationLevel is required' });
    }
    const record = await createRecord(req.user.id, req.body);
    res.status(201).json({ message: 'Education record added', record });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const list = async (req, res) => {
  try {
    const records = await getMyRecords(req.user.id);
    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const record = await updateRecord(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: 'Education record updated', record });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await deleteRecord(req.user.id, req.params.id);
    res.status(200).json({ message: 'Education record deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { create, list, update, remove };
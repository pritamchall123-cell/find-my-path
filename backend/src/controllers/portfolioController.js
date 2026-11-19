const { createEntry, getMyEntries, updateEntry, deleteEntry } = require('../services/portfolioService');

const create = async (req, res) => {
  try {
    const { title, description, skillsDemonstrated, links, status, completionDate, category, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const entry = await createEntry(req.user.id, {
      title,
      description,
      skillsDemonstrated,
      links,
      status,
      completionDate,
      category,
      isPublic,
    });
    res.status(201).json({ message: 'Portfolio entry created', entry });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const list = async (req, res) => {
  try {
    const entries = await getMyEntries(req.user.id);
    res.status(200).json({ entries });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const entry = await updateEntry(req.user.id, req.params.id, req.body);
    res.status(200).json({ message: 'Portfolio entry updated', entry });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await deleteEntry(req.user.id, req.params.id);
    res.status(200).json({ message: 'Portfolio entry deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { create, list, update, remove };
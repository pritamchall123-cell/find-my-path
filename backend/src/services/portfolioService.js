const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');

const ALLOWED_FIELDS = [
  'title',
  'description',
  'skillsDemonstrated',
  'links',
  'status',
  'completionDate',
  'category',
  'isPublic',
];

const cleanLink = (link) => {
  const trimmed = String(link).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Any other scheme (e.g. javascript:, data:) is rejected
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  // No scheme at all, e.g. "github.com/me" -> assume https
  return `https://${trimmed}`;
};

const pickAllowed = (data) => {
  const clean = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) clean[field] = data[field];
  });

  if (clean.links !== undefined) {
    clean.links = Array.isArray(clean.links)
      ? clean.links.map(cleanLink).filter(Boolean)
      : [];
  }

  return clean;
};

const notFound = () => {
  const error = new Error('Portfolio entry not found');
  error.statusCode = 404;
  return error;
};

const createEntry = async (userId, data) => {
  const entry = await Portfolio.create({ ...pickAllowed(data), user: userId });
  return entry;
};

const getMyEntries = async (userId) => {
  const entries = await Portfolio.find({ user: userId }).sort({ createdAt: -1 });
  return entries;
};

const updateEntry = async (userId, entryId, data) => {
  if (!mongoose.Types.ObjectId.isValid(entryId)) throw notFound();

  const entry = await Portfolio.findOneAndUpdate(
    { _id: entryId, user: userId },
    pickAllowed(data),
    { new: true, runValidators: true }
  );
  if (!entry) throw notFound();
  return entry;
};

const deleteEntry = async (userId, entryId) => {
  if (!mongoose.Types.ObjectId.isValid(entryId)) throw notFound();

  const entry = await Portfolio.findOneAndDelete({ _id: entryId, user: userId });
  if (!entry) throw notFound();
  return entry;
};

module.exports = { createEntry, getMyEntries, updateEntry, deleteEntry };
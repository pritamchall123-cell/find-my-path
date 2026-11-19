const mongoose = require('mongoose');
const EducationRecord = require('../models/EducationRecord');

const ALLOWED_FIELDS = [
  'institutionName',
  'institutionType',
  'qualification',
  'course',
  'specialization',
  'educationLevel',
  'boardOrUniversity',
  'startYear',
  'endYear',
  'status',
  'classOrStage',
  'marksOrGPA',
  'achievements',
  'notes',
  'displayOrder',
];

const pickAllowed = (data) => {
  const clean = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) clean[field] = data[field];
  });
  return clean;
};

const notFound = () => {
  const error = new Error('Education record not found');
  error.statusCode = 404;
  return error;
};

const createRecord = async (userId, data) => {
  const record = await EducationRecord.create({ ...pickAllowed(data), user: userId });
  return record;
};

const getMyRecords = async (userId) => {
  const records = await EducationRecord.find({ user: userId }).sort({ startYear: 1, displayOrder: 1 });
  return records;
};

const updateRecord = async (userId, recordId, data) => {
  if (!mongoose.Types.ObjectId.isValid(recordId)) throw notFound();

  const record = await EducationRecord.findOneAndUpdate(
    { _id: recordId, user: userId },
    pickAllowed(data),
    { new: true, runValidators: true }
  );
  if (!record) throw notFound();
  return record;
};

const deleteRecord = async (userId, recordId) => {
  if (!mongoose.Types.ObjectId.isValid(recordId)) throw notFound();

  const record = await EducationRecord.findOneAndDelete({ _id: recordId, user: userId });
  if (!record) throw notFound();
  return record;
};

module.exports = { createRecord, getMyRecords, updateRecord, deleteRecord };
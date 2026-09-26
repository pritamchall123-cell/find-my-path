const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const assessmentQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['interest', 'aptitude', 'workPreference', 'skillConfidence'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: [optionSchema],
    tag: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
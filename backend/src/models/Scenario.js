const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: 'Untitled Scenario',
    },
    inputs: {
      currentQualification: { type: String, trim: true },
      targetCareer: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
      preferredLocation: { type: String, trim: true },
      maxBudgetPerYear: { type: Number, default: null },
    },
    result: {
      steps: [{ type: String, trim: true }],
      eligibilityNotes: [{ type: String, trim: true }],
      matchingInstitutions: [
        {
          institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
          name: String,
          approxFeesPerYear: String,
        },
      ],
      relevantScholarshipCount: { type: Number, default: 0 },
      benefits: [{ type: String, trim: true }],
      tradeoffs: [{ type: String, trim: true }],
      alternativeCareers: [
        {
          career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
          name: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scenario', scenarioSchema);
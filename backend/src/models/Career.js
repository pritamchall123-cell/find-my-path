const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    sector: {
      type: String,
      enum: ['government', 'private', 'both'],
      default: 'private',
    },
    description: {
      type: String,
      required: true,
    },
    dayInLife: {
      type: String,
      trim: true,
    },
    responsibilities: [{ type: String, trim: true }],
    coreSkills: [
      {
        skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
        weight: { type: Number, min: 1, max: 10, default: 5 },
      },
    ],
    optionalSkills: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    ],
    pros: [{ type: String, trim: true }],
    cons: [{ type: String, trim: true }],
    industryOutlook: { type: String, trim: true },
    entryLevelRoles: [{ type: String, trim: true }],
    entryPaths: {
      streams: [{ type: String, trim: true }],
      degrees: [{ type: String, trim: true }],
    },
    eligibleDegrees: [{ type: String, trim: true }],
    examRequired: { type: String, trim: true, default: null },
    approxStartingSalary: { type: String, trim: true },
    careerGrowth: { type: String, trim: true },
    exampleProjects: [{ type: String, trim: true }],
    relatedCareers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
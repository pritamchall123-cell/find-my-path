const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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
    entryLevelRoles: [{ type: String, trim: true }],
    entryPaths: {
      streams: [{ type: String, trim: true }],
      degrees: [{ type: String, trim: true }],
    },
    exampleProjects: [{ type: String, trim: true }],
    relatedCareers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
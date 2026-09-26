const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    academic: {
      institutionName: { type: String, trim: true },
      stream: { type: String, trim: true },
      degree: { type: String, trim: true },
      branch: { type: String, trim: true },
      yearOrGrade: { type: String, trim: true },
    },
    interests: [{ type: String, trim: true }],
    skills: [
      {
        name: { type: String, trim: true },
        confidence: { type: Number, min: 1, max: 5 },
      },
    ],
    preferences: {
      workEnvironment: { type: String, trim: true },
      teamVsIndividual: { type: String, trim: true },
      remoteWork: { type: String, trim: true },
    },
    goals: {
      targetRole: { type: String, trim: true },
      preferredIndustry: { type: String, trim: true },
    },
    targetCareer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: { type: String },
    extractedText: { type: String },
    analysis: {
      skillsFound: [{ type: String }],
      missingSkills: [{ type: String }],
      alignmentScore: { type: Number },
      suggestions: [{ type: String }],
      summary: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
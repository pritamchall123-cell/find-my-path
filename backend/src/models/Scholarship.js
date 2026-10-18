const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['government', 'private', 'institutional'],
      default: 'government',
    },
    eligibleEducationLevels: [{ type: String, trim: true }],
    eligibilityCriteria: [{ type: String, trim: true }],
    awardDetails: { type: String, trim: true },
    applicationOpens: { type: String, trim: true },
    applicationCloses: { type: String, trim: true },
    requiredDocuments: [{ type: String, trim: true }],
    applicationUrl: { type: String, trim: true },
    dataProvenance: {
      source: { type: String, trim: true, default: 'Platform-curated (general knowledge)' },
      verificationStatus: {
        type: String,
        enum: ['verified', 'unverified', 'user-submitted'],
        default: 'unverified',
      },
      lastVerifiedDate: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
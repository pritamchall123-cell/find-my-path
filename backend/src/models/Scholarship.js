const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    providerType: {
      type: String,
      enum: ['central_government', 'state_government', 'private', 'foundation', 'university', 'other'],
      required: true,
    },
    providerName: { type: String, trim: true },
    educationLevels: [{ type: String, trim: true }],
    eligibleCourses: [{ type: String, trim: true }],
    eligibleStates: [{ type: String, trim: true }],
    domicileRules: { type: String, trim: true },
    eligibleCategories: [{ type: String, trim: true }],
    minimumMarks: { type: String, trim: true },
    incomeLimit: { type: String, trim: true },
    benefitAmount: { type: String, trim: true },
    benefitFrequency: {
      type: String,
      enum: ['monthly', 'annual', 'one_time', 'course_duration', 'not_specified'],
      default: 'not_specified',
    },
    freshApplicationsAllowed: { type: Boolean, default: null },
    renewalAllowed: { type: Boolean, default: null },
    applicationStatus: {
      type: String,
      enum: ['open', 'upcoming', 'closed', 'expected', 'paused', 'discontinued', 'unverified'],
      default: 'unverified',
    },
    applicationStartDate: { type: String, trim: true },
    applicationDeadline: { type: String, trim: true },
    officialApplicationUrl: { type: String, trim: true },
    officialGuidelinesUrl: { type: String, trim: true },
    sourceType: {
      type: String,
      enum: ['official', 'verified_partner', 'secondary_discovery'],
      default: 'secondary_discovery',
    },
    lastVerifiedAt: { type: Date, default: null },
    academicYear: { type: String, trim: true, default: '2026-27' },
    verificationNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
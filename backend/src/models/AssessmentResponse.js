const mongoose = require('mongoose');

const assessmentResponseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentQuestion' },
        selectedValue: { type: String },
      },
    ],
    reflections: {
      whatExcitesYou: { type: String, trim: true },
      recurringActivity: { type: String, trim: true },
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AssessmentResponse', assessmentResponseSchema);
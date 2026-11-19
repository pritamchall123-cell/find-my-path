const mongoose = require('mongoose');

const careerGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['exploring', 'active', 'paused', 'achieved', 'dropped'],
      default: 'exploring',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    targetDate: {
      type: Date,
      default: null,
    },
    motivation: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    statusChangedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One goal record per user per career
careerGoalSchema.index({ user: 1, career: 1 }, { unique: true });

module.exports = mongoose.model('CareerGoal', careerGoalSchema);
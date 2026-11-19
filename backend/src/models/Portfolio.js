const mongoose = require('mongoose');

const portfolioEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skillsDemonstrated: [{ type: String, trim: true }],
    links: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['completed', 'in_progress'],
      default: 'completed',
    },
    completionDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      enum: ['project', 'achievement', 'competition', 'certification', 'other'],
      default: 'project',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioEntrySchema);
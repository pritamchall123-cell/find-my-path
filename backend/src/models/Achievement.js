const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
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
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'academic',
        'learning',
        'project',
        'competition',
        'exam',
        'scholarship',
        'career',
        'personal',
        'other',
      ],
      default: 'other',
    },
    relatedSkill: { type: String, trim: true },
    evidenceLink: { type: String, trim: true },
  },
  { timestamps: true }
);

achievementSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);
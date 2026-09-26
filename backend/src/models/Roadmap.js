const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    resources: [{ type: String }],
    practiceTasks: [{ type: String }],
    project: { type: String },
    estimatedEffort: { type: String },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
  },
  { _id: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetCareer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    steps: [stepSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
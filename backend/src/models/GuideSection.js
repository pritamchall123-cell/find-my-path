const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    items: [{ type: String, trim: true }],
  },
  { _id: false }
);

const guideSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['qualification', 'examFamilies', 'industries', 'specializedRoadmap'],
      required: true,
    },
    level: {
      type: String,
      trim: true,
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    groups: [groupSchema],
    studyRoutes: [{ type: String, trim: true }],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GuideSection', guideSectionSchema);
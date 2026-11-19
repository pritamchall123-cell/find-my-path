const mongoose = require('mongoose');

const educationRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionName: { type: String, trim: true },
    institutionType: {
      type: String,
      enum: ['school', 'college', 'university', 'iti', 'polytechnic', 'coaching', 'other'],
      default: 'school',
    },
    qualification: { type: String, trim: true },
    course: { type: String, trim: true },
    specialization: { type: String, trim: true },
    educationLevel: {
      type: String,
      enum: ['class10', 'class12', 'iti_vocational', 'diploma', 'undergraduate', 'postgraduate', 'professional', 'other'],
      required: true,
    },
    boardOrUniversity: { type: String, trim: true },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'discontinued', 'planned'],
      default: 'ongoing',
    },
    classOrStage: { type: String, trim: true },
    marksOrGPA: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EducationRecord', educationRecordSchema);
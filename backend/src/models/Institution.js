const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['government', 'private', 'deemed'],
      default: 'private',
    },
    location: {
      city: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    degreesOffered: [{ type: String, trim: true }],
    approxFeesPerYear: { type: String, trim: true },
    notableFor: { type: String, trim: true },
    website: { type: String, trim: true },
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

module.exports = mongoose.model('Institution', institutionSchema);
const mongoose = require('mongoose');

const statePortalSchema = new mongoose.Schema(
  {
    stateOrUT: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ['state', 'union_territory'], default: 'state' },
    portals: [
      {
        name: { type: String, trim: true },
        note: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StatePortal', statePortalSchema);
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Profile = require('../models/Profile');
const Career = require('../models/Career');
const CareerGoal = require('../models/CareerGoal');

const backfill = async () => {
  await connectDB();

  const profiles = await Profile.find({ targetCareer: { $ne: null } });
  let created = 0;

  for (const profile of profiles) {
    const careerExists = await Career.exists({ _id: profile.targetCareer });
    if (!careerExists) continue;

    const existing = await CareerGoal.findOne({
      user: profile.user,
      career: profile.targetCareer,
    });
    if (existing) continue;

    // The profile's target is the truth, so make sure no other goal claims "primary"
    await CareerGoal.updateMany({ user: profile.user }, { isPrimary: false });
    await CareerGoal.create({
      user: profile.user,
      career: profile.targetCareer,
      status: 'active',
      isPrimary: true,
    });
    created++;
  }

  console.log(`Backfilled ${created} goal(s) from existing target careers.`);
  mongoose.connection.close();
};

backfill();
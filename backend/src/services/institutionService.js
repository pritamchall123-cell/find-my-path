const Institution = require('../models/Institution');
const Profile = require('../models/Profile');
const { calculateDistanceKm } = require('../utils/distance');

const getInstitutions = async ({ degree, city, pincode, lat, lng, maxDistanceKm }) => {
  let filter = {};

  const conditions = [];

  if (degree) {
    conditions.push({ degreesOffered: { $regex: degree, $options: 'i' } });
  }

  if (city) {
    conditions.push({
      $or: [
        { 'location.city': { $regex: city, $options: 'i' } },
        { 'location.district': { $regex: city, $options: 'i' } },
        { 'location.state': { $regex: city, $options: 'i' } },
      ],
    });
  }

  if (pincode) {
    conditions.push({ 'location.pincode': pincode });
  }

  if (conditions.length > 0) {
    filter = { $and: conditions };
  }

  let institutions = await Institution.find(filter).sort({ name: 1 }).lean();

  const userLat = lat ? parseFloat(lat) : null;
  const userLng = lng ? parseFloat(lng) : null;

  if (userLat != null && userLng != null) {
    institutions = institutions.map((inst) => {
      const distanceKm = calculateDistanceKm(
        userLat,
        userLng,
        inst.location?.coordinates?.lat,
        inst.location?.coordinates?.lng
      );
      return { ...inst, distanceKm };
    });

    if (maxDistanceKm) {
      const maxKm = parseFloat(maxDistanceKm);
      institutions = institutions.filter(
        (inst) => inst.distanceKm !== null && inst.distanceKm <= maxKm
      );
    }

    institutions.sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }

  return institutions;
};

const toggleSavedInstitution = async (userId, institutionId) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    {},
    { new: true, upsert: true }
  );

  const alreadySaved = profile.savedInstitutions.some((id) => id.toString() === institutionId);

  if (alreadySaved) {
    profile.savedInstitutions = profile.savedInstitutions.filter(
      (id) => id.toString() !== institutionId
    );
  } else {
    profile.savedInstitutions.push(institutionId);
  }

  await profile.save();
  return { saved: !alreadySaved, savedInstitutions: profile.savedInstitutions };
};

const getSavedInstitutions = async (userId) => {
  const profile = await Profile.findOne({ user: userId }).populate(
    'savedInstitutions',
    'name type location degreesOffered website'
  );
  return profile?.savedInstitutions || [];
};

module.exports = {
  getInstitutions,
  toggleSavedInstitution,
  getSavedInstitutions,
};
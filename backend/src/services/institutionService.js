const mongoose = require('mongoose');
const Institution = require('../models/Institution');
const Profile = require('../models/Profile');
const { calculateDistanceKm } = require('../utils/distance');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const VALID_TYPES = ['government', 'private', 'deemed'];

const getInstitutions = async ({
  degree, city, state, name, type, pincode, lat, lng, maxDistanceKm,
}) => {
  let filter = {};
  const conditions = [];

  if (name) {
    conditions.push({ name: { $regex: escapeRegex(name), $options: 'i' } });
  }

  if (degree) {
    conditions.push({ degreesOffered: { $regex: escapeRegex(degree), $options: 'i' } });
  }

  if (city) {
    const rx = escapeRegex(city);
    conditions.push({
      $or: [
        { 'location.city': { $regex: rx, $options: 'i' } },
        { 'location.district': { $regex: rx, $options: 'i' } },
        { 'location.state': { $regex: rx, $options: 'i' } },
      ],
    });
  }

  if (state) {
    conditions.push({ 'location.state': { $regex: `^${escapeRegex(state)}$`, $options: 'i' } });
  }

  if (type && VALID_TYPES.includes(type)) {
    conditions.push({ type });
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

const getInstitutionById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Institution.findById(id).lean();
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
    'name type location degreesOffered website imageUrl'
  );
  return profile?.savedInstitutions || [];
};

const httpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const str = (v) => (typeof v === 'string' ? v.trim() : '');

const cleanWebsite = (v) => {
  const s = str(v);
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) throw httpError(400, 'Website must be an http(s) link');
  return `https://${s}`;
};

const cleanImageUrl = (v) => {
  const s = str(v);
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) throw httpError(400, 'Image link must start with http:// or https://');
  return s;
};

const buildFlat = (body, { requireName }) => {
  const flat = {};

  if (body.name !== undefined || requireName) {
    const n = str(body.name);
    if (!n) throw httpError(400, 'Name is required');
    flat.name = n;
  }

  if (body.type !== undefined) {
    if (!VALID_TYPES.includes(body.type)) {
      throw httpError(400, 'Type must be government, private or deemed');
    }
    flat.type = body.type;
  }

  const loc = body.location || {};
  for (const k of ['city', 'district', 'state', 'pincode']) {
    if (loc[k] !== undefined) flat[`location.${k}`] = str(loc[k]);
  }

  const coords = loc.coordinates || {};
  for (const k of ['lat', 'lng']) {
    if (coords[k] === undefined) continue;
    if (coords[k] === '' || coords[k] === null) {
      flat[`location.coordinates.${k}`] = null;
    } else {
      const n = Number(coords[k]);
      const limit = k === 'lat' ? 90 : 180;
      if (!Number.isFinite(n) || Math.abs(n) > limit) {
        throw httpError(400, `Invalid ${k === 'lat' ? 'latitude' : 'longitude'}`);
      }
      flat[`location.coordinates.${k}`] = n;
    }
  }

  if (body.degreesOffered !== undefined) {
    const arr = Array.isArray(body.degreesOffered)
      ? body.degreesOffered
      : String(body.degreesOffered).split(',');
    flat.degreesOffered = arr.map((d) => String(d).trim()).filter(Boolean);
  }

  if (body.approxFeesPerYear !== undefined) flat.approxFeesPerYear = str(body.approxFeesPerYear);
  if (body.notableFor !== undefined) flat.notableFor = str(body.notableFor);
  if (body.website !== undefined) flat.website = cleanWebsite(body.website);
  if (body.imageUrl !== undefined) flat.imageUrl = cleanImageUrl(body.imageUrl);

  const prov = body.dataProvenance || {};
  if (prov.source !== undefined) flat['dataProvenance.source'] = str(prov.source);
  if (prov.verificationStatus !== undefined) {
    if (!['verified', 'unverified', 'user-submitted'].includes(prov.verificationStatus)) {
      throw httpError(400, 'Invalid verification status');
    }
    flat['dataProvenance.verificationStatus'] = prov.verificationStatus;
    if (prov.verificationStatus === 'verified' && !prov.lastVerifiedDate) {
      flat['dataProvenance.lastVerifiedDate'] = new Date();
    }
  }
  if (prov.lastVerifiedDate) {
    const d = new Date(prov.lastVerifiedDate);
    if (Number.isNaN(d.getTime())) throw httpError(400, 'Invalid verified date');
    flat['dataProvenance.lastVerifiedDate'] = d;
  }

  return flat;
};

const createInstitution = async (body) => {
  const flat = buildFlat(body, { requireName: true });
  const inst = new Institution();
  inst.set(flat);
  await inst.save();
  return inst.toObject();
};

const updateInstitution = async (id, body) => {
  if (!mongoose.isValidObjectId(id)) throw httpError(404, 'Institution not found');
  const inst = await Institution.findById(id);
  if (!inst) throw httpError(404, 'Institution not found');
  inst.set(buildFlat(body, { requireName: false }));
  await inst.save();
  return inst.toObject();
};

const deleteInstitution = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw httpError(404, 'Institution not found');
  const deleted = await Institution.findByIdAndDelete(id);
  if (!deleted) throw httpError(404, 'Institution not found');
  await Profile.updateMany(
    { savedInstitutions: id },
    { $pull: { savedInstitutions: id } }
  );
};

module.exports = {
  getInstitutions,
  getInstitutionById,
  toggleSavedInstitution,
  getSavedInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
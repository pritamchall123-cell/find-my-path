const Institution = require('../models/Institution');

const COLLEGE_WORDS = /\b(colleges?|institutes?|institutions?|universit(y|ies)|campus|admissions?|iits?|nits?|iiits?)\b/i;
const MAX_RESULTS = 5;

// Degree names that are also everyday English words
const AMBIGUOUS = [' be ', ' me '];

// "B.Tech" becomes " btech " so that whole words can be compared
const normalize = (text = '') =>
  ` ${String(text).toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, ' ').trim()} `;

const mentions = (message, value) => {
  if (!value) return false;
  const key = normalize(value);
  if (!key.trim() || AMBIGUOUS.includes(key)) return false;
  return normalize(message).includes(key);
};

const offersAny = (college, degrees) =>
  (college.degreesOffered || []).some((offered) =>
    degrees.some((wanted) => {
      const a = normalize(offered);
      const b = normalize(wanted);
      return Boolean(a.trim() && b.trim()) && (a.includes(b) || b.includes(a));
    })
  );

// Keep only what the AI needs
const toRecord = (c) => ({
  name: c.name,
  type: c.type,
  city: c.location?.city,
  state: c.location?.state,
  courses: c.degreesOffered,
  feesPerYear: c.approxFeesPerYear || 'Not listed',
  notableFor: c.notableFor,
  website: c.website || 'Not listed',
  verification: c.dataProvenance?.verificationStatus || 'unverified',
});

const findColleges = async (message, careerDegrees = []) => {
  // Not a college question, so send nothing
  if (!COLLEGE_WORDS.test(message)) return null;

  const all = await Institution.find().sort({ name: 1 }).lean();

  // Match a city or district first, then a state
  const byCity = all.filter(
    (c) => mentions(message, c.location?.city) || mentions(message, c.location?.district)
  );
  const byPlace = byCity.length
    ? byCity
    : all.filter((c) => mentions(message, c.location?.state));

  const askedDegrees = all
    .flatMap((c) => c.degreesOffered || [])
    .filter((degree) => mentions(message, degree));
  const wanted = askedDegrees.length ? askedDegrees : careerDegrees;

  const pool = byPlace.length ? byPlace : all;
  const byCourse = wanted.length ? pool.filter((c) => offersAny(c, wanted)) : [];

  let results = [];
  let matchedBy;

  if (byCourse.length) {
    results = byCourse;
    matchedBy = byPlace.length ? 'location and course' : 'course';
  } else if (byPlace.length) {
    results = byPlace;
    matchedBy = 'location only, course NOT matched';
  } else if (wanted.length) {
    matchedBy = 'no college in the database matches this course';
  } else {
    results = all;
    matchedBy = 'no filter, NOT matched to this student';
  }

  return {
    matchedBy,
    totalFound: results.length,
    colleges: results.slice(0, MAX_RESULTS).map(toRecord),
  };
};

module.exports = { findColleges };
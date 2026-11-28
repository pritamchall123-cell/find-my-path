const Scholarship = require('../models/Scholarship');

const SCHOLARSHIP_WORDS = /\b(scholarships?|stipends?|fellowships?|financial (aid|help|support)|fee waivers?)\b/i;
const MAX_RESULTS = 5;

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const LEVELS = {
  class10: /\b(class|std)\s*(10|x)\b|\b10th\b/i,
  class12: /\b(class|std)\s*(12|xii)\b|\b12th\b/i,
  diploma: /\b(diploma|polytechnic)\b/i,
  college: /\b(college|undergraduate|ug|degree|b\.?\s?tech)\b|\bafter\s+(class\s*)?12(th)?\b/i,
};

// ask: found in the question. has: found in the scholarship's categories
const CATEGORIES = [
  { ask: /\b(girls?|female|woman|women)\b/i, has: /girl|women/i },
  { ask: /\b(disabled|disability|disabilities|pwd|divyang)\b/i, has: /disabilit/i },
  { ask: /\bminority\b/i, has: /minority/i },
  { ask: /(?<![.\w])sc\b/i, has: /^SC$/ },
  { ask: /\bST\b/, has: /^ST$/ },
  { ask: /\bobc\b/i, has: /^OBC$/ },
];

// Lower number is shown first
const STATUS_ORDER = { open: 0, upcoming: 1, expected: 2, unverified: 3, closed: 4, paused: 5 };

const normalize = (text = '') =>
  ` ${String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

const findStates = (message) => {
  const text = normalize(message);
  const found = STATES.filter((state) => text.includes(normalize(state)));
  if (text.includes(' bengal ') && !found.includes('West Bengal')) found.push('West Bengal');
  return found;
};

// Keep only what the AI needs
const toRecord = (s) => ({
  name: s.name,
  provider: s.providerName,
  educationLevels: s.educationLevels?.length ? s.educationLevels : 'Not recorded',
  states: s.eligibleStates,
  categories: s.eligibleCategories,
  minimumMarks: s.minimumMarks,
  incomeLimit: s.incomeLimit,
  benefit: s.benefitAmount || 'Not listed',
  status: s.applicationStatus,
  deadline: s.applicationDeadline || 'Not listed',
  link: s.officialApplicationUrl || s.officialGuidelinesUrl || 'Not listed',
  lastVerified: s.lastVerifiedAt || 'Not recorded',
});

const findScholarships = async (message, studentLevel) => {
  // Not a scholarship question, so send nothing
  if (!SCHOLARSHIP_WORDS.test(message)) return null;

  // A level typed in the question wins over the signup level
  const askedLevels = Object.keys(LEVELS).filter((level) => LEVELS[level].test(message));
  const levels = askedLevels.length ? askedLevels : [studentLevel].filter(Boolean);
  const states = findStates(message);
  const categories = CATEGORIES.filter((c) => c.ask.test(message));

  const all = await Scholarship.find({ applicationStatus: { $ne: 'discontinued' } }).lean();

  const scored = all
    .filter((s) => {
      const sLevels = s.educationLevels || [];
      const sStates = s.eligibleStates || [];

      const levelOk =
        !levels.length || !sLevels.length || sLevels.some((l) => levels.includes(l));

      const stateOk =
        !states.length ||
        !sStates.length ||
        sStates.some(
          (x) => x === 'All India' || x.startsWith('Specified') || states.includes(x)
        );

      return levelOk && stateOk;
    })
    .map((s) => {
      let score = 0;
      if (s.educationLevels?.some((l) => levels.includes(l))) score += 4;
      if (s.eligibleStates?.some((x) => states.includes(x))) score += 3;
      // Without a state, show All India schemes first
      if (!states.length && s.eligibleStates?.includes('All India')) score += 2;
      if (categories.some((c) => s.eligibleCategories?.some((x) => c.has.test(x)))) score += 5;
      return { s, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (STATUS_ORDER[a.s.applicationStatus] ?? 9) - (STATUS_ORDER[b.s.applicationStatus] ?? 9)
    );

  return {
    matchedBy: `education level: ${levels.join(', ') || 'not given'}; state: ${states.join(', ') || 'not given'}`,
    totalFound: scored.length,
    scholarships: scored.slice(0, MAX_RESULTS).map(({ s }) => toRecord(s)),
  };
};

module.exports = { findScholarships };
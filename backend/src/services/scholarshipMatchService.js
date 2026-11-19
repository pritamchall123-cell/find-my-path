const Scholarship = require('../models/Scholarship');

const matchScholarships = async (answers) => {
  const { educationLevel, state, category, incomeRange, isGirl, hasDisability } = answers;

  const allScholarships = await Scholarship.find();

  const results = allScholarships.map((s) => {
    const matchedReasons = [];
    const unmetOrUnclear = [];
    let relevant = true;

    if (educationLevel) {
      if (s.educationLevels?.length === 0 || s.educationLevels.includes(educationLevel)) {
        if (s.educationLevels?.includes(educationLevel)) {
          matchedReasons.push(`Open to your education level (${educationLevel}).`);
        }
      } else {
        relevant = false;
      }
    }

    if (relevant && state) {
      const statesMatch =
        s.eligibleStates?.includes('All India') ||
        s.eligibleStates?.some((es) => es.toLowerCase() === state.toLowerCase());
      if (s.eligibleStates?.length > 0) {
        if (statesMatch) {
          matchedReasons.push(
            s.eligibleStates.includes('All India')
              ? 'Open to students across India.'
              : `Specifically available in ${state}.`
          );
        } else {
          relevant = false;
        }
      }
    }

    if (relevant && category && s.eligibleCategories?.length > 0) {
      const categoryText = s.eligibleCategories.join(' ').toLowerCase();
      if (category !== 'general' && categoryText.includes(category.toLowerCase())) {
        matchedReasons.push(`Matches your stated category (${category.toUpperCase()}).`);
      } else if (category === 'general' && !categoryText.match(/sc|st|obc|ebc|dnt|minority|disab/)) {
        matchedReasons.push('No specific category restriction found.');
      } else if (category !== 'general') {
        unmetOrUnclear.push(`This scheme's eligible categories (${s.eligibleCategories.join(', ')}) may not include yours — verify directly.`);
      }
    }

    if (relevant && isGirl && s.eligibleCategories?.some((c) => /girl|women/i.test(c))) {
      matchedReasons.push('Specifically for girl/women students, which matches your answer.');
    }

    if (relevant && hasDisability && s.eligibleCategories?.some((c) => /disab/i.test(c))) {
      matchedReasons.push('Specifically for students with disabilities, which matches your answer.');
    }

    if (relevant && s.incomeLimit && incomeRange) {
      unmetOrUnclear.push(`This scheme has an income condition (${s.incomeLimit}) — verify your family income qualifies before applying.`);
    }

    if (s.applicationStatus === 'unverified') {
      unmetOrUnclear.push('Application status is not independently verified — confirm on the official source before relying on this.');
    }
    if (s.applicationStatus === 'closed' || s.applicationStatus === 'discontinued') {
      relevant = false;
    }

    return { scholarship: s, matchedReasons, unmetOrUnclear, relevant };
  });

  return results
    .filter((r) => r.relevant)
    .sort((a, b) => b.matchedReasons.length - a.matchedReasons.length);
};

module.exports = { matchScholarships };
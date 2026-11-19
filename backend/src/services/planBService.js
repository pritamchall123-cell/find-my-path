const Career = require('../models/Career');
const Institution = require('../models/Institution');

const getPlanB = async (careerId) => {
  const career = await Career.findById(careerId)
    .populate('relatedCareers', 'name category approxStartingSalary')
    .populate('categoryRef', 'name');

  if (!career) {
    const error = new Error('Career not found');
    error.statusCode = 404;
    throw error;
  }

  const planB = {
    ifNotEligible: [],
    ifCantAfford: [],
    ifInterestsChange: [],
    nextAction: '',
  };

  // If an exam is required, flag the risk and point to related careers that don't need one
  if (career.examRequired) {
    planB.ifNotEligible.push(
      `${career.name} requires clearing ${career.examRequired}. If you don't clear it, your core skills and interests still transfer — see "If your interests change" below for related careers that don't require this exam.`
    );
  }
  if (career.sector === 'both') {
    planB.ifNotEligible.push(
      `${career.name} has both government and private entry routes — if you don't qualify for the government route (via exam), the private-sector path has a different (skills + interview based) entry process.`
    );
  }
  if (career.entryPaths?.degrees?.length > 1) {
    planB.ifNotEligible.push(
      `Multiple degree routes lead here: ${career.entryPaths.degrees.join(', ')} — if you don't get into your first choice, the others remain valid paths to the same career.`
    );
  }
  if (planB.ifNotEligible.length === 0) {
    planB.ifNotEligible.push('No specific eligibility barriers are flagged for this career in our data — verify current admission/recruitment requirements directly with the relevant institution or exam body.');
  }

  // Budget: find cheaper institutions offering a related degree, and note govt vs private cost gap
  const degreeToSearch = career.entryPaths?.degrees?.[0] || career.eligibleDegrees?.[0];
  if (degreeToSearch) {
    const institutions = await Institution.find({
      degreesOffered: { $regex: degreeToSearch, $options: 'i' },
    }).lean();

    const govtOptions = institutions.filter((i) => i.type === 'government');
    if (govtOptions.length > 0) {
      planB.ifCantAfford.push(
        `${govtOptions.length} government institution(s) in our database offer ${degreeToSearch} at typically lower fees than private options — government institutions are often the more affordable route for the same degree.`
      );
    }
    if (institutions.length === 0) {
      planB.ifCantAfford.push('No institutions in our current database are tagged with this exact degree — check the Find Colleges page with a broader search, or look into scholarships for this education level.');
    }
  }
  planB.ifCantAfford.push('Check the Scholarships page — several government and private scholarships may apply depending on your category and income level.');

  // Interests change: related careers (transferable skills) + siblings in the same category
  if (career.relatedCareers?.length > 0) {
    planB.ifInterestsChange = career.relatedCareers.map((rc) => ({
      careerId: rc._id,
      name: rc.name,
      reason: 'Listed as a related career — likely shares transferable skills with your original target.',
    }));
  } else if (career.categoryRef) {
    const siblings = await Career.find({
      categoryRef: career.categoryRef._id,
      _id: { $ne: career._id },
    }).select('name').limit(3);
    planB.ifInterestsChange = siblings.map((s) => ({
      careerId: s._id,
      name: s.name,
      reason: `Also in the ${career.categoryRef.name} category — your developing skills likely transfer here too.`,
    }));
  }

  planB.nextAction = career.examRequired
    ? `Start preparing for ${career.examRequired} early, but also build the core skills (${(career.coreSkills || []).length} listed) that transfer regardless of which route you end up taking.`
    : 'Focus on building the core skills this career needs — they&aposre the foundation that stays useful even if your exact path changes.';

  return planB;
};

module.exports = { getPlanB };
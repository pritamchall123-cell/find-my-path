const Career = require('../models/Career');
const Institution = require('../models/Institution');
const Scholarship = require('../models/Scholarship');
const Scenario = require('../models/Scenario');

const qualificationOrder = ['class10', 'class12', 'diploma', 'college', 'graduate', 'masters'];

const buildScenarioResult = async ({ currentQualification, targetCareerId, preferredLocation, maxBudgetPerYear }) => {
  const career = await Career.findById(targetCareerId)
    .populate('relatedCareers', 'name')
    .populate('coreSkills.skill', 'name');

  if (!career) {
    const error = new Error('Target career not found');
    error.statusCode = 404;
    throw error;
  }

  const steps = [];
  const eligibilityNotes = [];

  // Build steps based on how far the user's current qualification is from needing a degree
  const qualIndex = qualificationOrder.indexOf(currentQualification);

  if (qualIndex <= qualificationOrder.indexOf('class10')) {
    if (career.entryPaths?.streams?.length > 0) {
      steps.push(`Choose a stream in Class 11-12: ${career.entryPaths.streams.join(' or ')}`);
    } else {
      steps.push('Complete Class 11-12 in a relevant stream');
    }
  }

  if (qualIndex <= qualificationOrder.indexOf('class12')) {
    if (career.entryPaths?.degrees?.length > 0) {
      steps.push(`Pursue a degree: ${career.entryPaths.degrees.join(' or ')}`);
    } else if (career.eligibleDegrees?.length > 0) {
      steps.push(`Pursue a qualifying degree: ${career.eligibleDegrees.join(' or ')}`);
    }
    if (career.examRequired) {
      eligibilityNotes.push(`Entrance/recruitment exam required: ${career.examRequired} — verify current eligibility criteria on the official notification.`);
    }
  }

  const coreSkillNames = (career.coreSkills || []).filter((cs) => cs.skill).map((cs) => cs.skill.name);
  if (coreSkillNames.length > 0) {
    steps.push(`Build core skills: ${coreSkillNames.join(', ')}`);
  }

  steps.push('Build projects/portfolio evidence for the skills above');
  steps.push(`Target entry-level roles: ${(career.entryLevelRoles || []).join(', ') || 'Entry-level positions in this field'}`);

  // Matching institutions by degree + optional location/budget
  const degreeToSearch = career.entryPaths?.degrees?.[0] || career.eligibleDegrees?.[0] || '';
  let institutionFilter = {};
  const conditions = [];
  if (degreeToSearch) {
    conditions.push({ degreesOffered: { $regex: degreeToSearch, $options: 'i' } });
  }
  if (preferredLocation) {
    conditions.push({
      $or: [
        { 'location.city': { $regex: preferredLocation, $options: 'i' } },
        { 'location.state': { $regex: preferredLocation, $options: 'i' } },
      ],
    });
  }
  if (conditions.length > 0) institutionFilter = { $and: conditions };

  let matchingInstitutions = await Institution.find(institutionFilter).limit(10).lean();

  const extractMaxFee = (feeString) => {
    if (!feeString) return null;
    const numbers = feeString.match(/[\d.]+/g);
    if (!numbers) return null;
    const isLakh = /lakh/i.test(feeString);
    const max = Math.max(...numbers.map(Number));
    return isLakh ? max * 100000 : max;
  };

  if (maxBudgetPerYear) {
    matchingInstitutions = matchingInstitutions.filter((inst) => {
      const maxFee = extractMaxFee(inst.approxFeesPerYear);
      return maxFee === null || maxFee <= maxBudgetPerYear;
    });
  }

  if (matchingInstitutions.length === 0) {
    eligibilityNotes.push('No institutions in our current database match this exact degree/location/budget combination — try broadening your location or budget, or check the Find Colleges page directly.');
  }

  // Relevant scholarships for the user's eventual education level (degree stage)
  const relevantScholarshipCount = await Scholarship.countDocuments({
    eligibleEducationLevels: 'college',
  });

  const benefits = [];
  const tradeoffs = [];

  if (career.sector === 'government' || career.sector === 'both') {
    benefits.push('Government career path available — generally offers job security and defined pay scales.');
    tradeoffs.push('Government recruitment is exam-based and competitive — results aren\'t guaranteed by preparation alone.');
  }
  if (career.sector === 'private' || career.sector === 'both') {
    benefits.push('Private sector path available — often faster hiring and performance-based growth.');
    tradeoffs.push('Private sector roles typically offer less job security than equivalent government posts.');
  }
  if (career.examRequired) {
    tradeoffs.push(`Requires clearing ${career.examRequired}, which has its own preparation timeline and competition.`);
  }
  benefits.push(`Estimated starting salary range: ${career.approxStartingSalary || 'not available in our database — check current job postings for this figure.'}`);

  const alternativeCareers = (career.relatedCareers || []).map((rc) => ({
    career: rc._id,
    name: rc.name,
  }));

  return {
    steps,
    eligibilityNotes,
    matchingInstitutions: matchingInstitutions.map((inst) => ({
      institution: inst._id,
      name: inst.name,
      approxFeesPerYear: inst.approxFeesPerYear,
    })),
    relevantScholarshipCount,
    benefits,
    tradeoffs,
    alternativeCareers,
  };
};

const createScenario = async (userId, inputs, name) => {
  const result = await buildScenarioResult({
    currentQualification: inputs.currentQualification,
    targetCareerId: inputs.targetCareer,
    preferredLocation: inputs.preferredLocation,
    maxBudgetPerYear: inputs.maxBudgetPerYear,
  });

  const scenario = await Scenario.create({
    user: userId,
    name: name || 'Untitled Scenario',
    inputs,
    result,
  });

  return scenario;
};

const getMyScenarios = async (userId) => {
  const scenarios = await Scenario.find({ user: userId })
    .populate('inputs.targetCareer', 'name')
    .sort({ createdAt: -1 });
  return scenarios;
};

const deleteScenario = async (userId, scenarioId) => {
  const scenario = await Scenario.findOneAndDelete({ _id: scenarioId, user: userId });
  if (!scenario) {
    const error = new Error('Scenario not found');
    error.statusCode = 404;
    throw error;
  }
  return scenario;
};

const regenerateScenario = async (userId, scenarioId) => {
  const existing = await Scenario.findOne({ _id: scenarioId, user: userId });
  if (!existing) {
    const error = new Error('Scenario not found');
    error.statusCode = 404;
    throw error;
  }

  const result = await buildScenarioResult({
    currentQualification: existing.inputs.currentQualification,
    targetCareerId: existing.inputs.targetCareer,
    preferredLocation: existing.inputs.preferredLocation,
    maxBudgetPerYear: existing.inputs.maxBudgetPerYear,
  });

  existing.result = result;
  await existing.save();
  return existing;
};

module.exports = { createScenario, getMyScenarios, deleteScenario, regenerateScenario };
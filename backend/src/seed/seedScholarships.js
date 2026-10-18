require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Scholarship = require('../models/Scholarship');

const scholarships = [
  {
    name: 'National Means-cum-Merit Scholarship (NMMS)',
    provider: 'Ministry of Education, Government of India',
    type: 'government',
    eligibleEducationLevels: ['class10', 'class12'],
    eligibilityCriteria: [
      'Studying in Class 9-12 in a government/government-aided school',
      'Family income below the government-prescribed threshold (check current notification)',
      'Must clear the NMMS selection test',
    ],
    awardDetails: 'Monthly stipend for eligible students — exact amount set annually by the government; check the official portal for the current figure.',
    applicationOpens: 'Typically announced by state education departments each academic year',
    applicationCloses: 'Varies by state — check official notification',
    requiredDocuments: ['Income certificate', 'School enrollment proof', 'Caste certificate (if applicable)'],
    applicationUrl: 'https://scholarships.gov.in',
  },
  {
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    provider: 'Ministry of Social Justice and Empowerment, Government of India',
    type: 'government',
    eligibleEducationLevels: ['class12', 'college', 'graduate'],
    eligibilityCriteria: [
      'Belongs to SC/ST/OBC category (as per government classification)',
      'Enrolled in a recognized post-matriculation course',
      'Family income below the prescribed threshold (check current notification)',
    ],
    awardDetails: 'Covers tuition fees and provides maintenance allowance — amounts vary by state and course; check the official portal.',
    applicationOpens: 'Typically opens at the start of the academic year',
    applicationCloses: 'Varies by state — check official notification',
    requiredDocuments: ['Caste certificate', 'Income certificate', 'Previous year mark sheet', 'Bank account details'],
    applicationUrl: 'https://scholarships.gov.in',
  },
  {
    name: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science & Technology, Government of India',
    type: 'government',
    eligibleEducationLevels: ['college'],
    eligibilityCriteria: [
      'Among top rank holders in Class 12 board exams (state/national), or top performers in specific national exams',
      'Pursuing a Bachelor\'s/integrated Master\'s degree in Natural or Basic Sciences',
    ],
    awardDetails: 'Annual scholarship amount set by DST — check the official portal for the current figure.',
    applicationOpens: 'Typically after Class 12 board results are declared',
    applicationCloses: 'Check official INSPIRE portal for current-year deadline',
    requiredDocuments: ['Class 12 mark sheet', 'College admission proof', 'Bank account details'],
    applicationUrl: 'https://online-inspire.gov.in',
  },
  {
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'All India Council for Technical Education (AICTE)',
    type: 'government',
    eligibleEducationLevels: ['college'],
    eligibilityCriteria: [
      'Female student admitted to an AICTE-approved technical diploma/degree program',
      'Family income below the prescribed threshold (check current notification)',
      'Limited to 2 girl children per family',
    ],
    awardDetails: 'Annual financial assistance for tuition and other expenses — amount set by AICTE; check the official portal.',
    applicationOpens: 'Typically at the start of the academic year',
    applicationCloses: 'Check official AICTE portal for current-year deadline',
    requiredDocuments: ['Income certificate', 'Admission proof', 'Aadhaar card', 'Bank account details'],
    applicationUrl: 'https://www.aicte-pragati-saksham-gov.in',
  },
  {
    name: 'Kishore Vaigyanik Protsahan Yojana (KVPY) Fellowship',
    provider: 'Indian Institute of Science (IISc), on behalf of DST',
    type: 'government',
    eligibleEducationLevels: ['class12', 'college'],
    eligibilityCriteria: [
      'Clear the KVPY aptitude test (Note: check current status — KVPY has been merged/restructured in recent years; verify active status before applying)',
      'Interest in pursuing a research career in Basic Sciences',
    ],
    awardDetails: 'Monthly fellowship plus annual contingency grant — amounts set by DST.',
    applicationOpens: 'Historically announced mid-year — verify current program status',
    applicationCloses: 'Verify current program status before planning around this',
    requiredDocuments: ['Academic records', 'Identity proof'],
    applicationUrl: 'https://www.dst.gov.in',
  },
  {
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    type: 'private',
    eligibleEducationLevels: ['college'],
    eligibilityCriteria: [
      'Enrolled in the first year of an undergraduate degree at a recognized Indian institution',
      'Demonstrated financial need and academic merit',
    ],
    awardDetails: 'Financial assistance for tuition and related expenses — current amount and number of scholarships set annually; check the official portal.',
    applicationOpens: 'Typically announced at the start of the academic year',
    applicationCloses: 'Check official portal for current-year deadline',
    requiredDocuments: ['Income proof', 'Academic transcripts', 'Admission letter'],
    applicationUrl: 'https://www.reliancefoundation.org/scholarships',
  },
  {
    name: 'Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Ministry of Education, Government of India',
    type: 'government',
    eligibleEducationLevels: ['college'],
    eligibilityCriteria: [
      'Scored above the 80th percentile in Class 12 boards (in the relevant stream)',
      'Family income below the prescribed threshold (check current notification)',
      'Pursuing a regular degree course',
    ],
    awardDetails: 'Annual scholarship amount set by the Ministry — check the official portal for the current figure.',
    applicationOpens: 'Typically after Class 12 results, each academic year',
    applicationCloses: 'Check official portal for current-year deadline',
    requiredDocuments: ['Class 12 mark sheet', 'Income certificate', 'College admission proof'],
    applicationUrl: 'https://scholarships.gov.in',
  },
];

const seed = async () => {
  await connectDB();

  for (const s of scholarships) {
    await Scholarship.findOneAndUpdate(
      { name: s.name },
      {
        ...s,
        dataProvenance: {
          source: 'Platform-curated (general knowledge of publicly known government/private programs)',
          verificationStatus: 'unverified',
          lastVerifiedDate: null,
        },
      },
      { upsert: true }
    );
  }

  console.log(`Seeded/updated ${scholarships.length} scholarships.`);
  mongoose.connection.close();
};

seed();
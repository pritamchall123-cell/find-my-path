require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const GuideSection = require('../models/GuideSection');

const sections = [
  {
    type: 'qualification',
    level: 'class10',
    title: 'After Class 10',
    subtitle: 'Eligibility, age limits, exams and recruitment rules vary by post and organization.',
    order: 1,
    groups: [
      {
        heading: 'Government / Public Sector',
        items: [
          'Indian Railways – Group C/D and Level-1 type recruitment (eligibility varies)',
          'Indian Army – eligible trades/entries depending on notification',
          'Indian Navy – 10th-based entries/trades where notified',
          'Indian Coast Guard – selected 10th-based posts where notified',
          'State Police – Constable-type posts where 10th eligibility is allowed',
          'State Government – Group C/D, support staff and field posts where 10th is eligible',
          'India Post – selected 10th-based posts such as GDS (notification-specific)',
          'Municipal / Local Government – support and field roles where eligible',
          'Defence support trades / apprenticeships – notification-specific',
        ],
      },
      {
        heading: 'Private / Skilled Careers',
        items: [
          'Data Entry Operator / Office Assistant',
          'Customer Support / BPO',
          'Retail Associate / Sales Executive',
          'Warehouse / Logistics Associate',
          'Field Technician / Service Technician',
          'Electrician / Wireman',
          'Plumber / HVAC Technician',
          'Welder / Fitter / Machinist',
          'Automobile Service Technician',
          'Graphic Design / Basic Digital Design',
          'Hospital / Healthcare support roles',
          'Security / Facility services',
          'Hospitality / Hotel support roles',
        ],
      },
    ],
    studyRoutes: [
      'Class 11–12 (Science / Commerce / Arts)',
      'ITI trades',
      'Polytechnic Diploma',
      'Vocational / Skill-development courses',
    ],
  },
  {
    type: 'qualification',
    level: 'class12',
    title: 'After Class 12',
    subtitle: 'Eligibility, age limits, exams and recruitment rules vary by post and organization.',
    order: 2,
    groups: [
      {
        heading: 'Government Careers',
        items: [
          'UPSC Civil Services – IAS, IPS, IFS and allied services (graduation required; not a direct 12th-entry exam)',
          'SSC CHSL – LDC/JSA, DEO and other posts as notified',
          'SSC Stenographer – Grade C/D',
          'Railway undergraduate-level recruitment when notified',
          'Indian Armed Forces – NDA/NA and other 12th-based entries',
          'Indian Navy – 10+2 based entries such as officer/sailor routes when notified',
          'Indian Coast Guard – 12th-based entries when notified',
          'State Police / Constable / selected departmental posts',
          'State-level clerical / assistant posts where 12th is eligible',
          'Teaching support / assistant roles where a specific qualification is prescribed',
          'Government apprenticeships',
        ],
      },
      {
        heading: 'Private Careers',
        items: [
          'IT Support / Help Desk',
          'Junior Web / Software roles after relevant training',
          'Digital Marketing Executive',
          'Content / Social Media Executive',
          'Sales / Business Development Executive',
          'Banking / Insurance Sales & Operations',
          'Customer Service / BPO',
          'Data Entry / Operations Executive',
          'Accounts Assistant after commerce/accounting training',
          'Graphic / UI Design after portfolio training',
          'Hotel / Hospitality jobs',
          'Travel / Aviation ground operations',
          'Logistics / Supply Chain operations',
        ],
      },
    ],
    studyRoutes: [
      'B.Tech / B.E.',
      'BCA / B.Sc. Computer Science / IT',
      'BBA / BBM',
      'B.Com',
      'BA',
      'LLB (integrated routes such as 5-year law)',
      'MBBS / BDS / B.Pharm / Nursing / Allied Health (eligibility varies)',
      'Architecture / Design',
      'CA / CMA / CS pathways',
      'Hotel Management',
      'Polytechnic / Diploma',
      'ITI / vocational programs',
    ],
  },
  {
    type: 'qualification',
    level: 'diploma',
    title: 'After Diploma / Polytechnic',
    subtitle: 'Eligibility, age limits, exams and recruitment rules vary by post and organization.',
    order: 3,
    groups: [
      {
        heading: 'Government / PSU / Public Sector',
        items: [
          'Junior Engineer (JE) – departments/organizations where diploma is accepted',
          'SSC JE – eligible engineering streams',
          'Railway JE / Technician – notification-specific',
          'State PWD / Irrigation / Electricity JE-type posts',
          'PSU technician / diploma trainee roles where notified',
          'Defence technical trades / technician posts',
          'Government apprenticeships',
        ],
      },
      {
        heading: 'Private',
        items: [
          'Junior Engineer / Site Engineer',
          'Production / Maintenance Engineer',
          'Quality Engineer / QA Technician',
          'CAD / Design Technician',
          'Network / IT Support',
          'Embedded / Electronics Technician',
          'Automation / PLC Technician',
          'Field Service Engineer',
          'Testing / Technician roles',
          'Construction / Infrastructure roles',
        ],
      },
    ],
    studyRoutes: [
      'B.Tech lateral entry (where permitted)',
      'Specialized certification',
      'Apprenticeship + industry experience',
    ],
  },
  {
    type: 'qualification',
    level: 'masters',
    title: "After Master's / M.Tech / MBA / MCA / M.Sc",
    subtitle: 'Eligibility, age limits, exams and recruitment rules vary by post and organization.',
    order: 5,
    groups: [
      {
        heading: 'Government / Research / Teaching',
        items: [
          'UPSC / State PSC graduate and specialist opportunities',
          'UGC-NET / JRF – subject and eligibility dependent',
          'Assistant Professor pathway after required qualifications',
          'Research Assistant / Project Associate',
          'Scientist / technical research roles in eligible organizations',
          'Government specialist / analyst roles',
        ],
      },
      {
        heading: 'Private',
        items: [
          'Senior Software Engineer',
          'Specialist Developer',
          'Data Scientist / ML Specialist',
          'Cybersecurity Specialist',
          'Cloud / DevOps Specialist',
          'Product Manager',
          'Business Analyst / Consultant',
          'Financial Analyst / Investment roles',
          'HR Manager / Talent Specialist',
          'Operations Manager',
          'Research & Development roles',
          'Management / Strategy roles',
        ],
      },
    ],
    studyRoutes: ['PhD', 'Postdoctoral research', 'Further specialization/certification'],
  },
];

const seed = async () => {
  await connectDB();

  for (const section of sections) {
    await GuideSection.findOneAndUpdate(
      { type: section.type, level: section.level },
      section,
      { upsert: true }
    );
  }

  console.log(`Seeded ${sections.length} guide section(s).`);
  mongoose.connection.close();
};

seed();
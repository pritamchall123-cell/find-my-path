require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Sector = require('../models/Sector');
const Category = require('../models/Category');
const Career = require('../models/Career');

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

const sectorDefinitions = [
  { name: 'IT & Software', icon: '💻', description: 'Software development, data, AI, cybersecurity, and cloud infrastructure careers.', displayOrder: 1 },
  { name: 'Design & Creative', icon: '🎨', description: 'Visual design, UX/UI, and creative digital work.', displayOrder: 2 },
  { name: 'Business & Management', icon: '📊', description: 'Strategy, product, marketing, and operations roles.', displayOrder: 3 },
  { name: 'Finance & Accounting', icon: '💰', description: 'Financial analysis, accounting, and advisory careers.', displayOrder: 4 },
  { name: 'Media & Communication', icon: '📝', description: 'Writing, journalism, and content careers.', displayOrder: 5 },
  { name: 'Engineering (Core)', icon: '🏗️', description: 'Civil, mechanical, and electrical engineering disciplines.', displayOrder: 6 },
  { name: 'Healthcare', icon: '🏥', description: 'Medical, nursing, and mental health careers.', displayOrder: 7 },
  { name: 'Education', icon: '📚', description: 'Teaching and instructional careers.', displayOrder: 8 },
  { name: 'Government & Public Service', icon: '🏛️', description: 'Civil services, banking, railways, and PSU careers.', displayOrder: 9 },
];

const categoryDefinitions = [
  { name: 'Software Development', sectorName: 'IT & Software' },
  { name: 'Data & AI', sectorName: 'IT & Software' },
  { name: 'Cybersecurity', sectorName: 'IT & Software' },
  { name: 'Cloud & Infrastructure', sectorName: 'IT & Software' },
  { name: 'UX/UI Design', sectorName: 'Design & Creative' },
  { name: 'Graphic Design', sectorName: 'Design & Creative' },
  { name: 'Product & Strategy', sectorName: 'Business & Management' },
  { name: 'Marketing', sectorName: 'Business & Management' },
  { name: 'Business Analysis', sectorName: 'Business & Management' },
  { name: 'Financial Services', sectorName: 'Finance & Accounting' },
  { name: 'Accounting', sectorName: 'Finance & Accounting' },
  { name: 'Writing & Journalism', sectorName: 'Media & Communication' },
  { name: 'Civil Engineering', sectorName: 'Engineering (Core)' },
  { name: 'Mechanical Engineering', sectorName: 'Engineering (Core)' },
  { name: 'Electrical Engineering', sectorName: 'Engineering (Core)' },
  { name: 'Medical', sectorName: 'Healthcare' },
  { name: 'Mental Health', sectorName: 'Healthcare' },
  { name: 'Teaching', sectorName: 'Education' },
  { name: 'Civil Services', sectorName: 'Government & Public Service' },
  { name: 'Banking & PSU', sectorName: 'Government & Public Service' },
  { name: 'Railways', sectorName: 'Government & Public Service' },
];

// Maps each existing career NAME to its new category NAME.
// Flagged careers (none currently) would go to a "Needs Review" bucket if unmatched.
const careerToCategoryMap = {
  'Software Developer': 'Software Development',
  'Data Analyst': 'Data & AI',
  'Data Engineer': 'Data & AI',
  'Machine Learning Engineer': 'Data & AI',
  'Cybersecurity Analyst': 'Cybersecurity',
  'Cloud Engineer': 'Cloud & Infrastructure',
  'DevOps Engineer': 'Cloud & Infrastructure',
  'UI/UX Designer': 'UX/UI Design',
  'Graphic Designer': 'Graphic Design',
  'Product Manager': 'Product & Strategy',
  'Business Analyst': 'Business Analysis',
  'Digital Marketing Specialist': 'Marketing',
  'Financial Analyst': 'Financial Services',
  'Chartered Accountant': 'Accounting',
  'Content Writer / Journalist': 'Writing & Journalism',
  'Civil Engineer': 'Civil Engineering',
  'Mechanical Engineer': 'Mechanical Engineering',
  'Electrical/Electronics Engineer': 'Electrical Engineering',
  'Doctor (MBBS)': 'Medical',
  'Psychologist / Counsellor': 'Mental Health',
  'Teacher / Educator': 'Teaching',
  'IAS / Civil Services Officer': 'Civil Services',
  'SSC CGL Officer (Various Departments)': 'Civil Services',
  'Bank PO / Officer (SBI/IBPS)': 'Banking & PSU',
  'PSU Engineer (via GATE)': 'Banking & PSU',
  'Railway Recruitment Board (RRB) Officer': 'Railways',
};

const migrate = async () => {
  await connectDB();

  // 1. Create sectors
  const sectorMap = {};
  for (const def of sectorDefinitions) {
    const sector = await Sector.findOneAndUpdate(
      { name: def.name },
      { ...def, slug: slugify(def.name) },
      { upsert: true, new: true }
    );
    sectorMap[def.name] = sector;
  }
  console.log(`Created/updated ${sectorDefinitions.length} sectors.`);

  // 2. Create categories
  const categoryMap = {};
  let order = 1;
  for (const def of categoryDefinitions) {
    const sector = sectorMap[def.sectorName];
    const category = await Category.findOneAndUpdate(
      { name: def.name, sector: sector._id },
      { name: def.name, slug: slugify(def.name), sector: sector._id, displayOrder: order },
      { upsert: true, new: true }
    );
    categoryMap[def.name] = category;
    order++;
  }
  console.log(`Created/updated ${categoryDefinitions.length} categories.`);

  // 3. Classify every existing career
  const allCareers = await Career.find();
  let classified = 0;
  let needsReview = [];

  for (const career of allCareers) {
    const categoryName = careerToCategoryMap[career.name];
    if (!categoryName || !categoryMap[categoryName]) {
      needsReview.push(career.name);
      continue;
    }
    const category = categoryMap[categoryName];
    career.categoryRef = category._id;
    career.sectorRef = category.sector;
    career.slug = slugify(career.name);
    await career.save();
    classified++;
  }

  console.log(`Classified ${classified} of ${allCareers.length} careers into the directory.`);
  if (needsReview.length > 0) {
    console.log('NEEDS MANUAL REVIEW (no category match found):', needsReview);
  }

  mongoose.connection.close();
};

migrate();
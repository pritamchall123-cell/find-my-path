require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Career = require('../models/Career');

const updates = [
  { name: 'Software Developer', sector: 'both', eligibleDegrees: ['B.Tech Computer Science', 'BCA', 'B.Sc Computer Science', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹4-8 LPA (private) / Pay Level 6-7 (government)', careerGrowth: 'Developer → Senior Developer → Tech Lead → Architect / Engineering Manager' },
  { name: 'Cybersecurity Analyst', sector: 'both', eligibleDegrees: ['B.Tech IT', 'B.Tech Computer Science', 'BCA'], examRequired: null, approxStartingSalary: '₹5-9 LPA (private) / Pay Level 7 (government)', careerGrowth: 'Analyst → Security Engineer → Security Architect → CISO' },
  { name: 'Data Analyst', sector: 'private', eligibleDegrees: ['B.Sc Statistics', 'B.Tech', 'BBA', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹4-7 LPA', careerGrowth: 'Analyst → Senior Analyst → Data Scientist / Analytics Manager' },
  { name: 'Data Engineer', sector: 'private', eligibleDegrees: ['B.Tech Computer Science', 'B.Tech IT'], examRequired: null, approxStartingSalary: '₹6-10 LPA', careerGrowth: 'Data Engineer → Senior Data Engineer → Data Architect' },
  { name: 'Machine Learning Engineer', sector: 'private', eligibleDegrees: ['B.Tech Computer Science', 'B.Tech AI/ML'], examRequired: null, approxStartingSalary: '₹6-12 LPA', careerGrowth: 'ML Engineer → Senior ML Engineer → ML Architect / Research Lead' },
  { name: 'Cloud Engineer', sector: 'private', eligibleDegrees: ['B.Tech Computer Science', 'B.Tech IT', 'BCA'], examRequired: null, approxStartingSalary: '₹5-9 LPA', careerGrowth: 'Cloud Engineer → Senior Cloud Engineer → Cloud Architect' },
  { name: 'DevOps Engineer', sector: 'private', eligibleDegrees: ['B.Tech Computer Science', 'B.Tech IT'], examRequired: null, approxStartingSalary: '₹6-10 LPA', careerGrowth: 'DevOps Engineer → SRE → Platform Lead' },
  { name: 'UI/UX Designer', sector: 'private', eligibleDegrees: ['B.Des', 'BFA', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹4-7 LPA', careerGrowth: 'Designer → Senior Designer → Design Lead / Head of Design' },
  { name: 'Graphic Designer', sector: 'private', eligibleDegrees: ['B.Des', 'BFA', 'Diploma in Graphic Design'], examRequired: null, approxStartingSalary: '₹3-5 LPA', careerGrowth: 'Designer → Senior Designer → Art Director' },
  { name: 'Product Manager', sector: 'private', eligibleDegrees: ['BBA', 'B.Tech', 'Any Graduate + MBA'], examRequired: null, approxStartingSalary: '₹8-15 LPA', careerGrowth: 'APM → PM → Senior PM → Head of Product' },
  { name: 'Business Analyst', sector: 'both', eligibleDegrees: ['BBA', 'B.Com', 'B.Tech', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹4-7 LPA', careerGrowth: 'BA → Senior BA → Business Consultant / Product Manager' },
  { name: 'Digital Marketing Specialist', sector: 'private', eligibleDegrees: ['BBA', 'B.Com', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹3-6 LPA', careerGrowth: 'Executive → Manager → Head of Marketing' },
  { name: 'Financial Analyst', sector: 'both', eligibleDegrees: ['B.Com', 'BBA Finance', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹4-8 LPA', careerGrowth: 'Analyst → Senior Analyst → Finance Manager' },
  { name: 'Chartered Accountant', sector: 'private', eligibleDegrees: ['B.Com + CA (ICAI)'], examRequired: 'ICAI CA Exams', approxStartingSalary: '₹7-12 LPA', careerGrowth: 'Article Assistant → CA → Senior CA → Partner' },
  { name: 'Content Writer / Journalist', sector: 'private', eligibleDegrees: ['BA English/Journalism', 'Mass Communication', 'Any Graduate'], examRequired: null, approxStartingSalary: '₹3-5 LPA', careerGrowth: 'Writer → Senior Writer → Editor' },
  { name: 'Civil Engineer', sector: 'both', eligibleDegrees: ['B.Tech Civil Engineering'], examRequired: 'GATE (for PSU/govt technical roles)', approxStartingSalary: '₹3-6 LPA (private) / Pay Level 7 (government)', careerGrowth: 'Site Engineer → Project Engineer → Project Manager' },
  { name: 'Mechanical Engineer', sector: 'both', eligibleDegrees: ['B.Tech Mechanical Engineering'], examRequired: 'GATE (for PSU/govt technical roles)', approxStartingSalary: '₹3-6 LPA (private) / Pay Level 7 (government)', careerGrowth: 'GET → Design Engineer → Senior Engineer → Manager' },
  { name: 'Electrical/Electronics Engineer', sector: 'both', eligibleDegrees: ['B.Tech Electrical/Electronics Engineering'], examRequired: 'GATE (for PSU/govt technical roles)', approxStartingSalary: '₹3-6 LPA (private) / Pay Level 7 (government)', careerGrowth: 'GET → Design Engineer → Senior Engineer → Manager' },
  { name: 'Doctor (MBBS)', sector: 'both', eligibleDegrees: ['MBBS'], examRequired: 'NEET-PG (for specialization/government hospital posts)', approxStartingSalary: '₹6-10 LPA', careerGrowth: 'Intern → Junior Resident → Specialist → Consultant' },
  { name: 'Psychologist / Counsellor', sector: 'private', eligibleDegrees: ['BA/B.Sc Psychology', 'M.A. Psychology/Counselling'], examRequired: null, approxStartingSalary: '₹3-6 LPA', careerGrowth: 'Counsellor → Senior Counsellor → Clinical Psychologist' },
  { name: 'Teacher / Educator', sector: 'both', eligibleDegrees: ['Any Graduate + B.Ed'], examRequired: 'CTET/TET (for government schools)', approxStartingSalary: '₹2.5-5 LPA (private) / Pay Level 6-7 (government)', careerGrowth: 'Teacher → Senior Teacher → Head of Department → Principal' },
];

const governmentOnlyCareers = [
  {
    name: 'IAS / Civil Services Officer',
    category: 'Government',
    sector: 'government',
    description: 'Administers government policy and public services as part of the Indian Administrative Service or allied civil services.',
    responsibilities: ['Implement government policy', 'Manage public administration', 'Oversee district/state operations'],
    coreSkills: [],
    optionalSkills: [],
    entryLevelRoles: ['Assistant Collector', 'Sub-Divisional Magistrate'],
    entryPaths: { streams: [], degrees: [] },
    eligibleDegrees: ['Any Graduate'],
    examRequired: 'UPSC Civil Services Examination',
    approxStartingSalary: 'Pay Level 10 (~₹56,100 + allowances)',
    careerGrowth: 'SDM → District Collector → Secretary-level posts',
    exampleProjects: [],
  },
  {
    name: 'SSC CGL Officer (Various Departments)',
    category: 'Government',
    sector: 'government',
    description: 'Works in various central government ministries and departments through the SSC Combined Graduate Level exam.',
    responsibilities: ['Department-specific administrative or technical work', 'Compliance and record-keeping', 'Public service delivery'],
    coreSkills: [],
    optionalSkills: [],
    entryLevelRoles: ['Assistant Section Officer', 'Inspector', 'Auditor'],
    entryPaths: { streams: [], degrees: [] },
    eligibleDegrees: ['Any Graduate'],
    examRequired: 'SSC CGL',
    approxStartingSalary: 'Pay Level 4-7 depending on post',
    careerGrowth: 'Entry post → Senior post → Departmental promotions',
    exampleProjects: [],
  },
  {
    name: 'Bank PO / Officer (SBI/IBPS)',
    category: 'Government',
    sector: 'government',
    description: 'Manages banking operations, customer service, and credit functions at public sector banks.',
    responsibilities: ['Handle banking operations', 'Process loans and credit', 'Ensure regulatory compliance'],
    coreSkills: [],
    optionalSkills: [],
    entryLevelRoles: ['Probationary Officer', 'Management Trainee'],
    entryPaths: { streams: [], degrees: [] },
    eligibleDegrees: ['Any Graduate'],
    examRequired: 'IBPS PO / SBI PO Exam',
    approxStartingSalary: 'Pay Scale ~₹36,000-40,000 + allowances',
    careerGrowth: 'PO → Manager → Senior Manager → AGM',
    exampleProjects: [],
  },
  {
    name: 'PSU Engineer (via GATE)',
    category: 'Government',
    sector: 'government',
    description: 'Works as an engineer in a Public Sector Undertaking (like ONGC, NTPC, BHEL) recruited through GATE scores.',
    responsibilities: ['Technical design and operations', 'Project execution', 'Quality and safety compliance'],
    coreSkills: [],
    optionalSkills: [],
    entryLevelRoles: ['Executive Trainee', 'Graduate Engineer Trainee'],
    entryPaths: { streams: [], degrees: [] },
    eligibleDegrees: ['B.Tech (any branch, PSU-dependent)'],
    examRequired: 'GATE',
    approxStartingSalary: '₹8-12 LPA (PSU pay scales + benefits)',
    careerGrowth: 'Executive Trainee → Engineer → Senior Engineer → Manager',
    exampleProjects: [],
  },
  {
    name: 'Railway Recruitment Board (RRB) Officer',
    category: 'Government',
    sector: 'government',
    description: 'Works in technical or administrative roles within Indian Railways.',
    responsibilities: ['Railway operations or technical maintenance', 'Safety compliance', 'Administrative coordination'],
    coreSkills: [],
    optionalSkills: [],
    entryLevelRoles: ['Junior Engineer', 'Station Master', 'Commercial Apprentice'],
    entryPaths: { streams: [], degrees: [] },
    eligibleDegrees: ['Any Graduate', 'Diploma/B.Tech (technical posts)'],
    examRequired: 'RRB NTPC / RRB JE',
    approxStartingSalary: 'Pay Level 5-7',
    careerGrowth: 'Junior post → Senior post → Departmental promotions',
    exampleProjects: [],
  },
];

const seed = async () => {
  await connectDB();

  for (const update of updates) {
    await Career.findOneAndUpdate({ name: update.name }, update);
  }

  for (const govCareer of governmentOnlyCareers) {
    const exists = await Career.findOne({ name: govCareer.name });
    if (!exists) {
      await Career.create(govCareer);
    }
  }

  console.log(`Updated ${updates.length} careers with sector/salary/exam data, added ${governmentOnlyCareers.length} government-only careers.`);
  mongoose.connection.close();
};

seed();
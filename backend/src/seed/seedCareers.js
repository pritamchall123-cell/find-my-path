require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Skill = require('../models/Skill');
const Career = require('../models/Career');

const skillList = [
  { name: 'Python', category: 'technology' },
  { name: 'JavaScript', category: 'technology' },
  { name: 'SQL', category: 'data' },
  { name: 'Communication', category: 'people-oriented' },
  { name: 'Problem Solving', category: 'analytical' },
  { name: 'Networking', category: 'technology' },
  { name: 'Linux', category: 'technology' },
  { name: 'Security Fundamentals', category: 'technology' },
  { name: 'Data Analysis', category: 'data' },
  { name: 'Statistics', category: 'data' },
  { name: 'Design Thinking', category: 'creative' },
  { name: 'UI Design', category: 'creative' },
  { name: 'Public Speaking', category: 'people-oriented' },
  { name: 'Excel', category: 'data' },
  { name: 'Business Analysis', category: 'analytical' },
];

const seed = async () => {
  await connectDB();

  await Skill.deleteMany({});
  await Career.deleteMany({});

  const skillDocs = await Skill.insertMany(skillList);
  const skillMap = {};
  skillDocs.forEach((s) => (skillMap[s.name] = s._id));

  const careers = [
    {
      name: 'Software Developer',
      category: 'Technology',
      description: 'Designs, builds, and maintains software applications and systems.',
      responsibilities: [
        'Write and test code',
        'Debug and fix issues',
        'Collaborate with a development team',
      ],
      coreSkills: [
        { skill: skillMap['Python'], weight: 8 },
        { skill: skillMap['JavaScript'], weight: 7 },
        { skill: skillMap['Problem Solving'], weight: 9 },
      ],
      optionalSkills: [skillMap['SQL']],
      entryLevelRoles: ['Junior Developer', 'Software Engineer Trainee'],
      entryPaths: {
        streams: ['Science'],
        degrees: ['B.Tech Computer Science', 'BCA', 'B.Sc Computer Science'],
      },
      exampleProjects: ['To-do list app', 'Portfolio website', 'REST API project'],
    },
    {
      name: 'Cybersecurity Analyst',
      category: 'Technology',
      description: 'Protects systems and networks from digital threats and breaches.',
      responsibilities: [
        'Monitor systems for security incidents',
        'Analyze vulnerabilities',
        'Respond to security breaches',
      ],
      coreSkills: [
        { skill: skillMap['Networking'], weight: 9 },
        { skill: skillMap['Linux'], weight: 7 },
        { skill: skillMap['Security Fundamentals'], weight: 9 },
      ],
      optionalSkills: [skillMap['Python']],
      entryLevelRoles: ['SOC Analyst', 'Security Trainee'],
      entryPaths: {
        streams: ['Science'],
        degrees: ['B.Tech IT', 'B.Tech Computer Science', 'BCA'],
      },
      exampleProjects: ['Password strength analyzer', 'Network port scanner'],
    },
    {
      name: 'Data Analyst',
      category: 'Technology',
      description: 'Collects, processes, and interprets data to help organizations make decisions.',
      responsibilities: [
        'Clean and analyze datasets',
        'Build reports and dashboards',
        'Present findings to stakeholders',
      ],
      coreSkills: [
        { skill: skillMap['SQL'], weight: 8 },
        { skill: skillMap['Statistics'], weight: 8 },
        { skill: skillMap['Data Analysis'], weight: 9 },
      ],
      optionalSkills: [skillMap['Python'], skillMap['Excel']],
      entryLevelRoles: ['Junior Data Analyst', 'Reporting Analyst'],
      entryPaths: {
        streams: ['Science', 'Commerce'],
        degrees: ['B.Sc Statistics', 'B.Tech', 'BBA'],
      },
      exampleProjects: ['Sales dashboard', 'Survey data analysis'],
    },
    {
      name: 'UI/UX Designer',
      category: 'Design',
      description: 'Designs user interfaces and experiences for digital products.',
      responsibilities: [
        'Create wireframes and prototypes',
        'Conduct user research',
        'Collaborate with developers',
      ],
      coreSkills: [
        { skill: skillMap['Design Thinking'], weight: 8 },
        { skill: skillMap['UI Design'], weight: 9 },
        { skill: skillMap['Communication'], weight: 6 },
      ],
      optionalSkills: [],
      entryLevelRoles: ['Junior UI Designer', 'UX Intern'],
      entryPaths: {
        streams: ['Science', 'Arts', 'Commerce'],
        degrees: ['B.Des', 'BFA', 'Any degree + design portfolio'],
      },
      exampleProjects: ['App redesign case study', 'Portfolio website'],
    },
    {
      name: 'Business Analyst',
      category: 'Business',
      description: 'Bridges business needs and technical solutions by analyzing processes and requirements.',
      responsibilities: [
        'Gather business requirements',
        'Analyze processes for improvement',
        'Communicate with stakeholders and technical teams',
      ],
      coreSkills: [
        { skill: skillMap['Business Analysis'], weight: 9 },
        { skill: skillMap['Communication'], weight: 8 },
        { skill: skillMap['Excel'], weight: 6 },
      ],
      optionalSkills: [skillMap['SQL'], skillMap['Data Analysis']],
      entryLevelRoles: ['Junior Business Analyst', 'Business Analyst Trainee'],
      entryPaths: {
        streams: ['Commerce', 'Science'],
        degrees: ['BBA', 'B.Com', 'B.Tech'],
      },
      exampleProjects: ['Process improvement case study', 'Requirements document sample'],
    },
  ];

  await Career.insertMany(careers);

  console.log(`Seeded ${skillDocs.length} skills and ${careers.length} careers.`);
  mongoose.connection.close();
};

seed();
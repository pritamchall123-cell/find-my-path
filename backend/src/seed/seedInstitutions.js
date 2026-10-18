require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Institution = require('../models/Institution');

const institutions = [
  {
    name: 'Indian Institute of Technology Delhi (IIT Delhi)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110016',
      coordinates: { lat: 28.5450, lng: 77.1926 },
    },
    degreesOffered: ['B.Tech Computer Science', 'B.Tech Mechanical Engineering', 'B.Tech Electrical/Electronics Engineering', 'B.Tech Civil Engineering'],
    approxFeesPerYear: '₹2-2.5 Lakh/year',
    notableFor: 'Among India\'s most respected engineering institutes; very competitive JEE Advanced cutoffs.',
    website: 'https://home.iitd.ac.in',
  },
  {
    name: 'National Institute of Technology Trichy (NIT Trichy)',
    type: 'government',
    location: {
      city: 'Tiruchirappalli',
      district: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      pincode: '620015',
      coordinates: { lat: 10.7592, lng: 78.8147 },
    },
    degreesOffered: ['B.Tech Computer Science', 'B.Tech IT', 'B.Tech Mechanical Engineering', 'B.Tech Electrical/Electronics Engineering'],
    approxFeesPerYear: '₹1.5-1.8 Lakh/year',
    notableFor: 'Top-tier NIT, strong placement record, admission via JEE Main.',
    website: 'https://www.nitt.edu',
  },
  {
    name: 'Vellore Institute of Technology (VIT)',
    type: 'private',
    location: {
      city: 'Vellore',
      district: 'Vellore',
      state: 'Tamil Nadu',
      pincode: '632014',
      coordinates: { lat: 12.9692, lng: 79.1559 },
    },
    degreesOffered: ['B.Tech Computer Science', 'B.Tech IT', 'B.Tech Mechanical Engineering', 'B.Tech Electrical/Electronics Engineering', 'B.Tech Civil Engineering'],
    approxFeesPerYear: '₹2-2.5 Lakh/year',
    notableFor: 'Large private university, own entrance exam (VITEEE), strong industry tie-ups.',
    website: 'https://vit.ac.in',
  },
  {
    name: 'Delhi Technological University (DTU)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'North West Delhi',
      state: 'Delhi',
      pincode: '110042',
      coordinates: { lat: 28.7500, lng: 77.1180 },
    },
    degreesOffered: ['B.Tech Computer Science', 'B.Tech IT', 'B.Tech Civil Engineering', 'B.Tech Mechanical Engineering'],
    approxFeesPerYear: '₹1.5-2 Lakh/year',
    notableFor: 'Formerly Delhi College of Engineering; strong reputation in North India, admission via JEE Main.',
    website: 'http://dtu.ac.in',
  },
  {
    name: 'Shri Ram College of Commerce (SRCC)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'North Delhi',
      state: 'Delhi',
      pincode: '110007',
      coordinates: { lat: 28.6889, lng: 77.2101 },
    },
    degreesOffered: ['B.Com', 'BA Economics'],
    approxFeesPerYear: '₹15,000-25,000/year',
    notableFor: 'One of India\'s most prestigious commerce colleges, very high cutoffs, under Delhi University.',
    website: 'https://www.srcc.edu',
  },
  {
    name: 'Narsee Monjee Institute of Management Studies (NMIMS)',
    type: 'private',
    location: {
      city: 'Mumbai',
      district: 'Mumbai Suburban',
      state: 'Maharashtra',
      pincode: '400056',
      coordinates: { lat: 19.1075, lng: 72.8263 },
    },
    degreesOffered: ['BBA', 'B.Com', 'BBA Finance'],
    approxFeesPerYear: '₹3-4 Lakh/year',
    notableFor: 'Strong reputation for business and management programs; own entrance exam (NPAT).',
    website: 'https://www.nmims.edu',
  },
  {
    name: 'Lady Shri Ram College for Women (LSR)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'South East Delhi',
      state: 'Delhi',
      pincode: '110024',
      coordinates: { lat: 28.5665, lng: 77.2432 },
    },
    degreesOffered: ['BA English/Journalism', 'BA Economics', 'B.Sc Statistics'],
    approxFeesPerYear: '₹15,000-25,000/year',
    notableFor: 'Top-ranked women\'s college under Delhi University, strong in humanities and social sciences.',
    website: 'http://lsr.edu.in',
  },
  {
    name: 'National Institute of Design (NID)',
    type: 'government',
    location: {
      city: 'Ahmedabad',
      district: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380007',
      coordinates: { lat: 23.0338, lng: 72.5574 },
    },
    degreesOffered: ['B.Des'],
    approxFeesPerYear: '₹2-3 Lakh/year',
    notableFor: 'India\'s premier design institute, highly competitive entrance (NID DAT).',
    website: 'https://www.nid.edu',
  },
  {
    name: 'National Institute of Fashion Technology (NIFT)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi (multiple campuses nationwide)',
      pincode: '110016',
      coordinates: { lat: 28.5584, lng: 77.1920 },
    },
    degreesOffered: ['B.Des', 'BFA'],
    approxFeesPerYear: '₹2-2.5 Lakh/year',
    notableFor: 'Leading fashion and design institute with campuses across India.',
    website: 'https://www.nift.ac.in',
  },
  {
    name: 'All India Institute of Medical Sciences Delhi (AIIMS Delhi)',
    type: 'government',
    location: {
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110029',
      coordinates: { lat: 28.5672, lng: 77.2100 },
    },
    degreesOffered: ['MBBS'],
    approxFeesPerYear: '₹5,000-10,000/year',
    notableFor: 'India\'s top medical institute, extremely competitive NEET cutoffs, very low fees for a government institution.',
    website: 'https://www.aiims.edu',
  },
  {
    name: 'Christian Medical College Vellore (CMC Vellore)',
    type: 'private',
    location: {
      city: 'Vellore',
      district: 'Vellore',
      state: 'Tamil Nadu',
      pincode: '632004',
      coordinates: { lat: 12.9243, lng: 79.1353 },
    },
    degreesOffered: ['MBBS', 'B.Sc Nursing'],
    approxFeesPerYear: '₹50,000-1 Lakh/year',
    notableFor: 'Highly respected private medical college with strong clinical training.',
    website: 'https://www.cmch-vellore.edu',
  },
  {
    name: 'Institute of Chartered Accountants of India (ICAI) — Regional Centers',
    type: 'government',
    location: {
      city: 'Multiple cities',
      district: '',
      state: 'Pan-India',
      pincode: '',
      coordinates: { lat: null, lng: null },
    },
    degreesOffered: ['B.Com + CA (ICAI)'],
    approxFeesPerYear: '₹20,000-50,000 total (across CA levels)',
    notableFor: 'The sole body offering the Chartered Accountancy qualification in India.',
    website: 'https://www.icai.org',
  },
];

const seed = async () => {
  await connectDB();

  for (const inst of institutions) {
    await Institution.findOneAndUpdate(
      { name: inst.name },
      {
        ...inst,
        dataProvenance: {
          source: 'Platform-curated (general knowledge)',
          verificationStatus: 'unverified',
          lastVerifiedDate: null,
        },
      },
      { upsert: true }
    );
  }

  console.log(`Seeded/updated ${institutions.length} institutions with coordinates and provenance.`);
  mongoose.connection.close();
};

seed();
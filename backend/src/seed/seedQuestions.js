require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AssessmentQuestion = require('../models/AssessmentQuestion');

const seed = async () => {
  await connectDB();

  await AssessmentQuestion.deleteMany({});

  const questions = [
    {
      category: 'interest',
      text: 'How much do you enjoy working with computers and technology?',
      tag: 'technology',
      options: [
        { text: 'Not at all', value: '1' },
        { text: 'A little', value: '2' },
        { text: 'Somewhat', value: '3' },
        { text: 'A lot', value: '4' },
        { text: 'Extremely', value: '5' },
      ],
    },
    {
      category: 'interest',
      text: 'How interested are you in analyzing numbers and data?',
      tag: 'data',
      options: [
        { text: 'Not at all', value: '1' },
        { text: 'A little', value: '2' },
        { text: 'Somewhat', value: '3' },
        { text: 'A lot', value: '4' },
        { text: 'Extremely', value: '5' },
      ],
    },
    {
      category: 'interest',
      text: 'How much do you enjoy creative or design-related work?',
      tag: 'creative',
      options: [
        { text: 'Not at all', value: '1' },
        { text: 'A little', value: '2' },
        { text: 'Somewhat', value: '3' },
        { text: 'A lot', value: '4' },
        { text: 'Extremely', value: '5' },
      ],
    },
    {
      category: 'aptitude',
      text: 'How comfortable are you with logical/step-by-step problem solving?',
      tag: 'analytical',
      options: [
        { text: 'Very uncomfortable', value: '1' },
        { text: 'Somewhat uncomfortable', value: '2' },
        { text: 'Neutral', value: '3' },
        { text: 'Comfortable', value: '4' },
        { text: 'Very comfortable', value: '5' },
      ],
    },
    {
      category: 'workPreference',
      text: 'Do you prefer working with people or working independently?',
      tag: 'people-oriented',
      options: [
        { text: 'Strongly prefer independent work', value: '1' },
        { text: 'Somewhat prefer independent', value: '2' },
        { text: 'No preference', value: '3' },
        { text: 'Somewhat prefer working with people', value: '4' },
        { text: 'Strongly prefer working with people', value: '5' },
      ],
    },
    {
      category: 'skillConfidence',
      text: 'How confident are you in your current programming skills?',
      tag: 'technology',
      options: [
        { text: 'No experience', value: '1' },
        { text: 'Beginner', value: '2' },
        { text: 'Intermediate', value: '3' },
        { text: 'Advanced', value: '4' },
        { text: 'Expert', value: '5' },
      ],
    },
  ];

  await AssessmentQuestion.insertMany(questions);

  console.log(`Seeded ${questions.length} assessment questions.`);
  mongoose.connection.close();
};

seed();
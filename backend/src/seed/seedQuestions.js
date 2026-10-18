require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AssessmentQuestion = require('../models/AssessmentQuestion');

const seed = async () => {
  await connectDB();

  await AssessmentQuestion.deleteMany({});

  const generalQuestions = [
    {
      category: 'interest',
      text: 'How much do you enjoy working with computers and technology?',
      tag: 'technology',
      forEducationLevel: 'all',
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
      forEducationLevel: 'all',
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
      forEducationLevel: 'all',
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
      forEducationLevel: 'all',
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
      forEducationLevel: 'all',
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
      forEducationLevel: 'college',
      options: [
        { text: 'No experience', value: '1' },
        { text: 'Beginner', value: '2' },
        { text: 'Intermediate', value: '3' },
        { text: 'Advanced', value: '4' },
        { text: 'Expert', value: '5' },
      ],
    },
  ];

  const class10Questions = [
    {
      category: 'interest',
      text: 'Do you enjoy figuring out how machines, gadgets, or computers work?',
      tag: 'technology',
      forEducationLevel: 'class10',
      options: [
        { text: 'Not really', value: '1' },
        { text: 'A little curious', value: '2' },
        { text: 'Yes, sometimes', value: '3' },
        { text: 'Yes, quite a bit', value: '4' },
        { text: 'I love taking things apart to understand them', value: '5' },
      ],
    },
    {
      category: 'interest',
      text: 'Do you enjoy drawing, designing, writing stories, or making things look good?',
      tag: 'creative',
      forEducationLevel: 'class10',
      options: [
        { text: 'Not really my thing', value: '1' },
        { text: 'A little', value: '2' },
        { text: 'Sometimes', value: '3' },
        { text: 'Yes, I enjoy it a lot', value: '4' },
        { text: 'It\'s one of my favorite things to do', value: '5' },
      ],
    },
    {
      category: 'interest',
      text: 'Do you like solving puzzles, playing strategy games, or working with numbers?',
      tag: 'analytical',
      forEducationLevel: 'class10',
      options: [
        { text: 'Not really', value: '1' },
        { text: 'Sometimes', value: '2' },
        { text: 'I enjoy it', value: '3' },
        { text: 'I really enjoy it', value: '4' },
        { text: 'It\'s my favorite kind of challenge', value: '5' },
      ],
    },
    {
      category: 'interest',
      text: 'Would you rather help people directly (like teaching, caring, or leading a team)?',
      tag: 'people-oriented',
      forEducationLevel: 'class10',
      options: [
        { text: 'I prefer working alone', value: '1' },
        { text: 'Sometimes', value: '2' },
        { text: 'I enjoy it', value: '3' },
        { text: 'I really enjoy helping/leading others', value: '4' },
        { text: 'It energizes me the most', value: '5' },
      ],
    },
    {
      category: 'workPreference',
      text: 'When you finish schoolwork, what do you usually gravitate toward?',
      tag: 'data',
      forEducationLevel: 'class10',
      options: [
        { text: 'Sports or physical activities', value: '2' },
        { text: 'Art, music, or writing', value: '2' },
        { text: 'Video games or building/coding things', value: '4' },
        { text: 'Reading or researching things I\'m curious about', value: '4' },
        { text: 'Talking with friends and organizing group activities', value: '3' },
      ],
    },
    {
      category: 'aptitude',
      text: 'In school, which subjects do you usually find easiest or most enjoyable?',
      tag: 'analytical',
      forEducationLevel: 'class10',
      options: [
        { text: 'Math and Science', value: '5' },
        { text: 'Languages and Social Studies', value: '3' },
        { text: 'Art and Design subjects', value: '3' },
        { text: 'A mix of everything, no strong favorite', value: '3' },
        { text: 'None really stand out yet, and that\'s okay', value: '2' },
      ],
    },
  ];

  const allQuestions = [...generalQuestions, ...class10Questions];
  await AssessmentQuestion.insertMany(allQuestions);

  console.log(`Seeded ${allQuestions.length} assessment questions (${generalQuestions.length} general, ${class10Questions.length} Class 10).`);
  mongoose.connection.close();
};

seed();
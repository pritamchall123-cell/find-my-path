const User = require('../models/User');
const Profile = require('../models/Profile');
const AssessmentResponse = require('../models/AssessmentResponse');
const Roadmap = require('../models/Roadmap');
const Resume = require('../models/Resume');

const getMilestones = async (userId) => {
  const user = await User.findById(userId);
  const profile = await Profile.findOne({ user: userId });
  const assessmentCount = await AssessmentResponse.countDocuments({ user: userId });
  const roadmap = await Roadmap.findOne({ user: userId });
  const resume = await Resume.findOne({ user: userId });

  const savedCount = profile?.savedCareers?.length || 0;
  const completedSteps = roadmap?.steps?.filter((s) => s.status === 'completed').length || 0;

  const milestones = [
    {
      key: 'first_assessment',
      icon: '📝',
      title: 'Took Your First Assessment',
      achieved: assessmentCount >= 1,
    },
    {
      key: 'explorer',
      icon: '🧭',
      title: 'Explored 5 Careers',
      achieved: savedCount >= 5,
      progress: `${Math.min(savedCount, 5)}/5`,
    },
    {
      key: 'target_set',
      icon: '🎯',
      title: 'Set a Target Career',
      achieved: !!profile?.targetCareer,
    },
    {
      key: 'roadmap_started',
      icon: '🗺️',
      title: 'Generated Your Roadmap',
      achieved: !!roadmap,
    },
    {
      key: 'first_step',
      icon: '✅',
      title: 'Completed Your First Roadmap Step',
      achieved: completedSteps >= 1,
    },
    {
      key: 'halfway',
      icon: '🏔️',
      title: 'Completed 50% of Your Roadmap',
      achieved: roadmap ? completedSteps / roadmap.steps.length >= 0.5 : false,
    },
    {
      key: 'resume_uploaded',
      icon: '📄',
      title: 'Analyzed Your Resume',
      achieved: !!resume,
    },
    {
      key: 'streak_3',
      icon: '🔥',
      title: '3-Day Streak',
      achieved: (user?.currentStreak || 0) >= 3,
    },
    {
      key: 'streak_7',
      icon: '⚡',
      title: '7-Day Streak',
      achieved: (user?.currentStreak || 0) >= 7,
    },
  ];

  return {
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
    milestones,
    achievedCount: milestones.filter((m) => m.achieved).length,
    totalCount: milestones.length,
  };
};

module.exports = { getMilestones };
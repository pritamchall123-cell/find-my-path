const EducationRecord = require('../models/EducationRecord');
const Portfolio = require('../models/Portfolio');
const Roadmap = require('../models/Roadmap');
const AssessmentResponse = require('../models/AssessmentResponse');
const Achievement = require('../models/Achievement');

const getTimeline = async (userId) => {
  const events = [];

  // Education records -> start and (if finished) completion events
  const educationRecords = await EducationRecord.find({ user: userId }).lean();
  educationRecords.forEach((rec) => {
    const label = rec.qualification || rec.course || rec.educationLevel;
    const place = rec.institutionName ? ` at ${rec.institutionName}` : '';

    if (rec.startYear) {
      events.push({
        id: `edu-start-${rec._id}`,
        type: 'education',
        origin: 'auto',
        title: `Started ${label}${place}`,
        date: new Date(rec.startYear, 0, 1),
        dateIsApproximate: true,
        source: 'education',
        sourceId: rec._id,
      });
    }

    if (rec.status === 'completed' && rec.endYear) {
      events.push({
        id: `edu-end-${rec._id}`,
        type: 'education',
        origin: 'auto',
        title: `Completed ${label}${place}`,
        date: new Date(rec.endYear, 0, 1),
        dateIsApproximate: true,
        source: 'education',
        sourceId: rec._id,
      });
    }
  });

  // Portfolio entries -> only completed ones count
  const portfolioEntries = await Portfolio.find({ user: userId }).lean();
  portfolioEntries.forEach((entry) => {
    if (entry.status === 'completed') {
      events.push({
        id: `portfolio-${entry._id}`,
        type: 'project',
        origin: 'auto',
        title: `Completed: ${entry.title}`,
        date: entry.completionDate || entry.updatedAt,
        dateIsApproximate: !entry.completionDate,
        source: 'portfolio',
        sourceId: entry._id,
      });
    }
  });

  // Roadmap steps -> only steps the user marked completed
  const roadmap = await Roadmap.findOne({ user: userId }).lean();
  if (roadmap) {
    roadmap.steps.forEach((step) => {
      if (step.status === 'completed') {
        events.push({
          id: `roadmap-${step._id}`,
          type: 'roadmap',
          origin: 'auto',
          title: `Roadmap step completed: ${step.title}`,
          date: roadmap.updatedAt,
          dateIsApproximate: true,
          source: 'roadmap',
          sourceId: step._id,
        });
      }
    });
  }

  // Assessments -> one event per completed assessment
  const assessments = await AssessmentResponse.find({ user: userId }).lean();
  assessments.forEach((a) => {
    events.push({
      id: `assessment-${a._id}`,
      type: 'assessment',
      origin: 'auto',
      title: 'Completed a career assessment',
      date: a.completedAt || a.createdAt,
      dateIsApproximate: false,
      source: 'assessment',
      sourceId: a._id,
    });
  });

  // Achievements -> written by the user, exact dates
  const achievements = await Achievement.find({ user: userId }).lean();
  achievements.forEach((a) => {
    events.push({
      id: `achievement-${a._id}`,
      type: 'achievement',
      origin: 'user',
      title: a.title,
      detail: a.description || '',
      date: a.date,
      dateIsApproximate: false,
      source: 'achievement',
      sourceId: a._id,
    });
  });

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return events;
};

module.exports = { getTimeline };
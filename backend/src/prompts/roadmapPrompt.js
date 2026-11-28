const buildRoadmapPrompt = ({ careerName, educationLevel, gaps, entryPaths }) => {
  const gapText = gaps
    .map((g) => `${g.skill} (readiness: ${g.readiness}%, gap: ${g.gap}%)`)
    .join('; ');

  const streams = entryPaths?.streams?.join(', ') || 'relevant streams';
  const degrees = entryPaths?.degrees?.join(', ') || 'relevant degrees';

  const startingPoints = {
    class10: {
      label: 'Class 10',
      note: `Step 1 MUST be choosing a stream (options: ${streams}). Step 2 MUST be choosing a degree (options: ${degrees}) and preparing for admission. Later steps introduce beginner skills that fit alongside school studies.`,
    },
    class12: {
      label: 'Class 12',
      note: `Step 1 MUST be choosing a degree (options: ${degrees}) and preparing for admission. Do not include stream selection. Later steps build beginner skills.`,
    },
    college: {
      label: 'College student',
      note: 'Start directly with core skills. Do not include stream or degree selection. Include projects and internships that fit alongside classes.',
    },
    graduate: {
      label: 'Graduate',
      note: 'Start with the biggest skill gaps. Do not include stream or degree selection. Focus on projects, portfolio, interview preparation and job applications.',
    },
  };

  const { label, note } = startingPoints[educationLevel] || startingPoints.college;

  return `You are generating a personalized learning roadmap for a student on FindMyPath, a career guidance platform for Indian students.

Target career: ${careerName}
Student's education level: ${label}
Student's current skill gaps (from real assessment data): ${gapText}

STARTING POINT RULES (these come first):
${note}

Generate 5-8 ordered roadmap steps. After the starting point, follow this general structure where it suits the student's level: foundation -> core skills -> practice -> projects -> portfolio -> interview prep. Prioritize skills with the highest gap percentage. Each step should be realistic and actionable for a beginner.

Respond ONLY with valid JSON, no other text, in this exact format:
[
  {
    "title": "Step title",
    "description": "2-3 sentence description of what to do in this step and why",
    "skills": ["Skill1", "Skill2"],
    "resources": ["General resource type or platform, e.g. 'freeCodeCamp Python course'"],
    "practiceTasks": ["Practice task 1", "Practice task 2"],
    "project": "One project idea for this step, or empty string if not applicable",
    "estimatedEffort": "e.g. '2-3 weeks'"
  }
]`;
};

module.exports = { buildRoadmapPrompt };
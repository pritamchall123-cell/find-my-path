const buildRoadmapPrompt = ({ careerName, educationLevel, gaps, entryPaths }) => {
  const gapText = gaps
    .map((g) => `${g.skill} (readiness: ${g.readiness}%, gap: ${g.gap}%)`)
    .join('; ');

  const startingPointNote =
    educationLevel === 'class10'
      ? `The student is in Class 10. The roadmap MUST start with stream selection (options: ${entryPaths.streams.join(', ') || 'relevant streams'}), then degree selection (${entryPaths.degrees.join(', ') || 'relevant degrees'}), before moving to skills.`
      : educationLevel === 'class12'
      ? `The student is in Class 12. The roadmap MUST start with degree selection (${entryPaths.degrees.join(', ') || 'relevant degrees'}), before moving to skills.`
      : `The student is in college or a graduate. The roadmap should start directly with core skills.`;

  return `You are generating a personalized learning roadmap for a student on FindMyPath, a career guidance platform.

Target career: ${careerName}
Student's education level: ${educationLevel}
Student's current skill gaps (from real assessment data): ${gapText}

${startingPointNote}

Generate 5-8 ordered roadmap steps following this general structure: foundation → core skills → practice → projects → portfolio → interview prep. Prioritize skills with the highest gap percentage. Each step should be realistic and actionable for a beginner.

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
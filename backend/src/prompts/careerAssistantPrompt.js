const buildAssistantContext = ({ profile, targetCareerName, skillGap, roadmap, reflections }) => {
  let context = `You are the AI Career Assistant on FindMyPath, a career guidance platform for Indian students. Answer the student's question helpfully and conversationally, using ONLY the context below about them. If you don't have relevant data to answer something specific, say so honestly rather than guessing.

STUDENT CONTEXT:
`;

  if (profile?.academic) {
    context += `Education: ${JSON.stringify(profile.academic)}\n`;
  }
  if (targetCareerName) {
    context += `Target career: ${targetCareerName}\n`;
  }
  if (skillGap?.gaps?.length) {
    const topGaps = skillGap.gaps.slice(0, 5)
      .map((g) => `${g.skill} (${g.gap}% gap)`)
      .join(', ');
    context += `Top skill gaps: ${topGaps}\n`;
  }
  if (roadmap?.steps?.length) {
    const stepTitles = roadmap.steps.map((s) => `${s.title} [${s.status}]`).join(', ');
    context += `Current roadmap steps: ${stepTitles}\n`;
  }
  if (reflections?.whatExcitesYou) {
    context += `In their own words, what excites them: "${reflections.whatExcitesYou}"\n`;
  }
  if (reflections?.recurringActivity) {
    context += `Something they keep coming back to: "${reflections.recurringActivity}"\n`;
  }

  if (!profile?.academic && !targetCareerName) {
    context += `(This student hasn't completed their profile or picked a target career yet — encourage them to do so for personalized guidance, but still answer general career questions helpfully.)\n`;
  }

  return context;
};

module.exports = { buildAssistantContext };

const buildResumeAnalysisPrompt = ({ resumeText, careerName, requiredSkills }) => {
  return `You are analyzing a student's resume for career alignment on FindMyPath, a career guidance platform.

Target career: ${careerName}
Required skills for this career: ${requiredSkills.join(', ')}

RESUME TEXT:
${resumeText.slice(0, 6000)}

Analyze the resume against the target career. Base your analysis ONLY on what's actually written in the resume text above — do not assume skills that aren't mentioned.

Respond ONLY with valid JSON, no other text, in this exact format:
{
  "skillsFound": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "alignmentScore": 65,
  "suggestions": ["suggestion 1", "suggestion 2"],
  "summary": "2-3 sentence overall summary of the resume's alignment with this career"
}`;
};

module.exports = { buildResumeAnalysisPrompt };
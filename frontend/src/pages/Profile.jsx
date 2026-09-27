import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function Profile() {
  const [form, setForm] = useState({
    academic: { institutionName: '', stream: '', degree: '', branch: '', yearOrGrade: '' },
    interests: [],
    skills: [],
    preferences: { workEnvironment: '', teamVsIndividual: '', remoteWork: '' },
    goals: { targetRole: '', preferredIndustry: '' },
  });
  const [interestInput, setInterestInput] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillConfidence, setNewSkillConfidence] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/profile/me');
        const p = res.data.profile;
        setForm({
          academic: p.academic || {},
          interests: p.interests || [],
          skills: p.skills || [],
          preferences: p.preferences || {},
          goals: p.goals || {},
        });
      } catch (err) {
        // No profile yet — keep default empty form, that's fine
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAcademicChange = (e) => {
    setForm({ ...form, academic: { ...form.academic, [e.target.name]: e.target.value } });
  };

  const handlePreferenceChange = (e) => {
    setForm({ ...form, preferences: { ...form.preferences, [e.target.name]: e.target.value } });
  };

  const handleGoalChange = (e) => {
    setForm({ ...form, goals: { ...form.goals, [e.target.name]: e.target.value } });
  };

  const addInterest = () => {
    if (!interestInput.trim()) return;
    setForm({ ...form, interests: [...form.interests, interestInput.trim()] });
    setInterestInput('');
  };

  const removeInterest = (i) => {
    setForm({ ...form, interests: form.interests.filter((_, idx) => idx !== i) });
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setForm({
      ...form,
      skills: [...form.skills, { name: newSkillName.trim(), confidence: Number(newSkillConfidence) }],
    });
    setNewSkillName('');
    setNewSkillConfidence(3);
  };

  const removeSkill = (i) => {
    setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await axiosInstance.put('/profile/me', form);
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Academic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="institutionName"
              placeholder="School / College name"
              value={form.academic.institutionName || ''}
              onChange={handleAcademicChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="stream"
              placeholder="Stream (e.g. Science)"
              value={form.academic.stream || ''}
              onChange={handleAcademicChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree (e.g. B.Tech)"
              value={form.academic.degree || ''}
              onChange={handleAcademicChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch (e.g. Computer Science)"
              value={form.academic.branch || ''}
              onChange={handleAcademicChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="yearOrGrade"
              placeholder="Year / Grade (e.g. 2nd year, Class 12)"
              value={form.academic.yearOrGrade || ''}
              onChange={handleAcademicChange}
              className="border rounded p-2 sm:col-span-2"
            />
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Interests</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="e.g. Technology, Design"
              className="flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={addInterest}
              className="bg-gray-100 px-4 rounded hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.interests.map((interest, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {interest}
                <button type="button" onClick={() => removeInterest(i)} className="text-blue-900">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex gap-2 mb-3 items-center">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Skill name (e.g. Python)"
              className="flex-1 border rounded p-2"
            />
            <select
              value={newSkillConfidence}
              onChange={(e) => setNewSkillConfidence(e.target.value)}
              className="border rounded p-2"
            >
              <option value={1}>1 - Beginner</option>
              <option value={2}>2</option>
              <option value={3}>3 - Moderate</option>
              <option value={4}>4</option>
              <option value={5}>5 - Expert</option>
            </select>
            <button
              type="button"
              onClick={addSkill}
              className="bg-gray-100 px-4 rounded hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {form.skills.map((skill, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm"
              >
                <span>
                  {skill.name} — Confidence: {skill.confidence}/5
                </span>
                <button
                  type="button"
                  onClick={() => removeSkill(i)}
                  className="text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="workEnvironment"
              placeholder="Work environment (e.g. Remote, Office)"
              value={form.preferences.workEnvironment || ''}
              onChange={handlePreferenceChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="teamVsIndividual"
              placeholder="Team vs Individual work"
              value={form.preferences.teamVsIndividual || ''}
              onChange={handlePreferenceChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="remoteWork"
              placeholder="Remote work preference"
              value={form.preferences.remoteWork || ''}
              onChange={handlePreferenceChange}
              className="border rounded p-2 sm:col-span-2"
            />
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Career Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="targetRole"
              placeholder="Target role"
              value={form.goals.targetRole || ''}
              onChange={handleGoalChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="preferredIndustry"
              placeholder="Preferred industry"
              value={form.goals.preferredIndustry || ''}
              onChange={handleGoalChange}
              className="border rounded p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
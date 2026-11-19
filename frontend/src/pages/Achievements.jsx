import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const categoryConfig = {
  academic: { label: 'Academic', icon: '📚' },
  learning: { label: 'Learning', icon: '💡' },
  project: { label: 'Project', icon: '🛠️' },
  competition: { label: 'Competition', icon: '🏆' },
  exam: { label: 'Exam', icon: '📝' },
  scholarship: { label: 'Scholarship', icon: '🎁' },
  career: { label: 'Career', icon: '💼' },
  personal: { label: 'Personal', icon: '🌱' },
  other: { label: 'Other', icon: '📌' },
};

const today = new Date().toISOString().split('T')[0];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  category: 'other',
  relatedSkill: '',
  evidenceLink: '',
};

const isSafeLink = (link) => /^https?:\/\//i.test(link || '');

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAchievements = async () => {
    try {
      const res = await axiosInstance.get('/achievements');
      setAchievements(res.data.achievements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      description: a.description || '',
      date: a.date ? a.date.split('T')[0] : '',
      category: a.category,
      relatedSkill: a.relatedSkill || '',
      evidenceLink: a.evidenceLink || '',
    });
    setEditingId(a._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await axiosInstance.put(`/achievements/${editingId}`, form);
      } else {
        await axiosInstance.post('/achievements', form);
      }
      resetForm();
      fetchAchievements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this achievement? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/achievements/${id}`);
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader message="Loading your achievements..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">My Achievements</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Achievement'}
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Milestones in your own words — big or small. Only you can see this page.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

          <input
            type="text"
            placeholder="What did you achieve? e.g. Finished my Python course"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={150}
            required
            className="w-full border rounded p-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              max={today}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="border rounded p-2"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded p-2"
            >
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.icon} {cfg.label}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="A few words about it (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={1000}
            rows={3}
            className="w-full border rounded p-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Related skill (optional)"
              value={form.relatedSkill}
              onChange={(e) => setForm({ ...form, relatedSkill: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="url"
              placeholder="Proof link, starting with https:// (optional)"
              value={form.evidenceLink}
              onChange={(e) => setForm({ ...form, evidenceLink: e.target.value })}
              className="border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : editingId ? 'Update Achievement' : 'Save Achievement'}
          </button>
        </form>
      )}

      {achievements.length === 0 && !showForm && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-1">No achievements recorded yet.</p>
          <p className="text-sm text-gray-400">
            Passed an exam, finished a course, built something? Add it here — it becomes part of
            your journey.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {achievements.map((a) => {
          const cfg = categoryConfig[a.category] || categoryConfig.other;
          return (
            <div key={a._id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <span>{cfg.icon}</span>
                  {a.title}
                </h2>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                  {cfg.label}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(a.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              {a.description && <p className="text-sm text-gray-700 mt-2">{a.description}</p>}

              <div className="flex flex-wrap gap-3 mt-2 items-center">
                {a.relatedSkill && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                    {a.relatedSkill}
                  </span>
                )}
                {isSafeLink(a.evidenceLink) && (
                  <a
                    href={a.evidenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    🔗 View proof
                  </a>
                )}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-xs text-gray-600 font-medium hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;
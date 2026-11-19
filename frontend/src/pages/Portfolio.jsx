import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const categoryIcons = {
  project: '🛠️',
  achievement: '🏅',
  competition: '🏆',
  certification: '📜',
  other: '📌',
};

function Portfolio() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    skillsDemonstrated: '',
    links: '',
    status: 'completed',
    completionDate: '',
    category: 'project',
    isPublic: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchEntries = async () => {
    try {
      const res = await axiosInstance.get('/portfolio');
      setEntries(res.data.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      skillsDemonstrated: '',
      links: '',
      status: 'completed',
      completionDate: '',
      category: 'project',
      isPublic: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry) => {
    setForm({
      title: entry.title,
      description: entry.description || '',
      skillsDemonstrated: (entry.skillsDemonstrated || []).join(', '),
      links: (entry.links || []).join(', '),
      status: entry.status,
      completionDate: entry.completionDate ? entry.completionDate.split('T')[0] : '',
      category: entry.category,
      isPublic: entry.isPublic,
    });
    setEditingId(entry._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      description: form.description,
      skillsDemonstrated: form.skillsDemonstrated
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      links: form.links
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      status: form.status,
      completionDate: form.completionDate || null,
      category: form.category,
      isPublic: form.isPublic,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/portfolio/${editingId}`, payload);
      } else {
        await axiosInstance.post('/portfolio', payload);
      }
      resetForm();
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this portfolio entry?')) return;
    try {
      await axiosInstance.delete(`/portfolio/${id}`);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader message="Loading your portfolio..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Real projects and achievements — the evidence behind your skills, not just a self-rating.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

          <input
            type="text"
            placeholder="Title — e.g. Personal Portfolio Website"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Description — what you built and why"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Skills demonstrated (comma-separated) — e.g. React, Problem Solving"
            value={form.skillsDemonstrated}
            onChange={(e) => setForm({ ...form, skillsDemonstrated: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Links (comma-separated) — GitHub, live demo, certificate, etc."
            value={form.links}
            onChange={(e) => setForm({ ...form, links: e.target.value })}
            className="w-full border rounded p-2"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border rounded p-2 text-sm"
            >
              <option value="project">Project</option>
              <option value="achievement">Achievement</option>
              <option value="competition">Competition</option>
              <option value="certification">Certification</option>
              <option value="other">Other</option>
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded p-2 text-sm"
            >
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
            </select>
            <input
              type="date"
              value={form.completionDate}
              onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
              className="border rounded p-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm border rounded p-2">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
              />
              Public
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Add Entry'}
          </button>
        </form>
      )}

      {entries.length === 0 && !showForm && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-2">No portfolio entries yet.</p>
          <p className="text-sm text-gray-400">
            Add your first project, certification, or achievement to start building real evidence of your skills.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <span>{categoryIcons[entry.category]}</span>
                {entry.title}
              </h2>
              <div className="flex gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    entry.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {entry.status.replace('_', ' ')}
                </span>
                {entry.isPublic && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Public</span>
                )}
              </div>
            </div>

            {entry.description && <p className="text-sm text-gray-700 mt-2">{entry.description}</p>}

            {entry.skillsDemonstrated?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {entry.skillsDemonstrated.map((s, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {entry.links?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {entry.links.filter((l) => /^https?:\/\//i.test(l)).map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs font-medium hover:underline"
                  >
                    🔗 {link.length > 40 ? link.slice(0, 40) + '...' : link}
                  </a>
                ))}
              </div>
            )}

            {entry.completionDate && (
              <p className="text-xs text-gray-400 mt-2">
                Completed: {new Date(entry.completionDate).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleEdit(entry)}
                className="text-xs text-gray-600 font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-xs text-red-600 font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
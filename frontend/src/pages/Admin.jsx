import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const emptyForm = {
  name: '',
  category: '',
  description: '',
  responsibilities: '',
  entryLevelRoles: '',
};

const inputClass =
  'w-full border border-gray-300 rounded-lg p-2 text-sm bg-white mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300';

const toLines = (text) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

const fromList = (list) =>
  (Array.isArray(list) ? list : []).filter((x) => typeof x === 'string').join('\n');

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}
    </label>
  );
}

function Admin() {
  const [careers, setCareers] = useState([]);
  const [skillCount, setSkillCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoadError('');
    try {
      const [careersRes, skillsRes] = await Promise.all([
        axiosInstance.get('/careers'),
        axiosInstance.get('/admin/skills'),
      ]);
      setCareers(careersRes.data.careers);
      setSkillCount(skillsRes.data.skills.length);
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Could not load careers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setError('');
    setSuccess('');
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (c) => {
    setError('');
    setSuccess('');
    setEditingId(c._id);
    setForm({
      name: c.name || '',
      category: c.category || '',
      description: c.description || '',
      responsibilities: fromList(c.responsibilities),
      entryLevelRoles: fromList(c.entryLevelRoles),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const fields = {
      name: form.name,
      category: form.category,
      description: form.description,
      responsibilities: toLines(form.responsibilities),
      entryLevelRoles: toLines(form.entryLevelRoles),
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/admin/careers/${editingId}`, fields);
        setSuccess('Career updated.');
      } else {
        await axiosInstance.post('/admin/careers', {
          ...fields,
          coreSkills: [],
          optionalSkills: [],
          entryPaths: { streams: [], degrees: [] },
          exampleProjects: [],
        });
        setSuccess('Career added. Add its skills with the seed script.');
      }
      closeForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the career.');
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    setError('');
    setSuccess('');
    try {
      await axiosInstance.delete(`/admin/careers/${c._id}`);
      if (editingId === c._id) closeForm();
      setSuccess('Career deleted.');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the career.');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter((c) =>
      [c.name, c.category, c.sectorRef?.name].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [careers, search]);

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Careers</h1>
          <p className="text-gray-600">
            {careers.length} careers{skillCount !== null ? `, ${skillCount} skills in the catalog` : ''}.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 text-sm"
          >
            + Add Career
          </button>
        )}
      </div>

      {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      {success && <p className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Career' : 'Add New Career'}</h2>
            <button type="button" onClick={closeForm} className="text-sm text-gray-600 hover:underline">
              Cancel
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Career name *">
              <input className={inputClass} value={form.name} onChange={setField('name')} required />
            </Field>
            <Field label="Category">
              <input className={inputClass} value={form.category} onChange={setField('category')} />
            </Field>
          </div>

          <Field label="Description *">
            <textarea
              className={inputClass}
              rows={4}
              value={form.description}
              onChange={setField('description')}
              required
            />
          </Field>

          <Field label="Responsibilities" hint="One per line.">
            <textarea
              className={inputClass}
              rows={4}
              value={form.responsibilities}
              onChange={setField('responsibilities')}
            />
          </Field>

          <Field label="Entry-level roles" hint="One per line.">
            <textarea
              className={inputClass}
              rows={3}
              value={form.entryLevelRoles}
              onChange={setField('entryLevelRoles')}
            />
          </Field>

          {editingId && (
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              Skills, entry paths, sectors and example projects are not editable here yet. Those are
              managed with the seed scripts.
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Career'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center gap-3 flex-wrap">
        <input
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="🔍 Search by name, category or sector"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-xs text-gray-500">
          Showing {filtered.length} of {careers.length}
        </span>
      </div>

      {loading && <p className="text-gray-500">Loading careers...</p>}

      {!loading && loadError && (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-red-600 mb-3">{loadError}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !loadError && filtered.length === 0 && (
        <p className="text-gray-500">No careers match your search.</p>
      )}

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c._id} className="bg-white rounded-xl shadow-sm p-4 flex gap-3 items-center">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{c.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {c.category && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                )}
                {c.sectorRef?.name && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {c.sectorRef.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => handleEdit(c)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c)}
                className="text-sm font-medium text-red-600 hover:underline"
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

export default Admin;
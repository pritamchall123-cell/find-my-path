import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function Admin() {
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', category: '', description: '' });
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [careersRes, skillsRes] = await Promise.all([
        axiosInstance.get('/careers'),
        axiosInstance.get('/admin/skills'),
      ]);
      setCareers(careersRes.data.careers);
      setSkills(skillsRes.data.skills);
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied or failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await axiosInstance.post('/admin/careers', {
        ...form,
        responsibilities: [],
        coreSkills: [],
        optionalSkills: [],
        entryLevelRoles: [],
        entryPaths: { streams: [], degrees: [] },
        exampleProjects: [],
      });
      setForm({ name: '', category: '', description: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create career');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this career?')) return;
    try {
      await axiosInstance.delete(`/admin/careers/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading admin panel...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Career</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            placeholder="Career name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full border rounded p-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Add Career'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Note: core skills, responsibilities, and other details can be added via the seed script or a future edit form — this quickly creates the base record.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Existing Careers ({careers.length})</h2>
        <p className="text-xs text-gray-500 mb-3">{skills.length} skills in the catalog</p>
        <div className="space-y-2">
          {careers.map((c) => (
            <div key={c._id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
              <div>
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-gray-500 ml-2">({c.category})</span>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const levelLabels = {
  class10: 'Class 10',
  class12: 'Class 12',
  iti_vocational: 'ITI / Vocational',
  diploma: 'Diploma / Polytechnic',
  undergraduate: 'Undergraduate',
  postgraduate: 'Postgraduate',
  professional: 'Professional Qualification',
  other: 'Other',
};

const statusConfig = {
  ongoing: { label: 'Ongoing', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  discontinued: { label: 'Discontinued', color: 'bg-gray-200 text-gray-600' },
  planned: { label: 'Planned', color: 'bg-amber-100 text-amber-700' },
};

const emptyForm = {
  institutionName: '',
  institutionType: 'school',
  qualification: '',
  course: '',
  specialization: '',
  educationLevel: 'class10',
  boardOrUniversity: '',
  startYear: '',
  endYear: '',
  status: 'ongoing',
  classOrStage: '',
  marksOrGPA: '',
  achievements: '',
  notes: '',
};

function EducationHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/education');
      setRecords(res.data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (record) => {
    setForm({
      institutionName: record.institutionName || '',
      institutionType: record.institutionType,
      qualification: record.qualification || '',
      course: record.course || '',
      specialization: record.specialization || '',
      educationLevel: record.educationLevel,
      boardOrUniversity: record.boardOrUniversity || '',
      startYear: record.startYear || '',
      endYear: record.endYear || '',
      status: record.status,
      classOrStage: record.classOrStage || '',
      marksOrGPA: record.marksOrGPA || '',
      achievements: (record.achievements || []).join(', '),
      notes: record.notes || '',
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      startYear: form.startYear ? Number(form.startYear) : null,
      endYear: form.endYear ? Number(form.endYear) : null,
      achievements: form.achievements.split(',').map((a) => a.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/education/${editingId}`, payload);
      } else {
        await axiosInstance.post('/education', payload);
      }
      resetForm();
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this education record?')) return;
    try {
      await axiosInstance.delete(`/education/${id}`);
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader message="Loading your education history..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Education History</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Your full academic journey — Class 10 through any degree, diploma, or certification.
      </p>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.educationLevel}
              onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
              className="border rounded p-2"
              required
            >
              {Object.entries(levelLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={form.institutionType}
              onChange={(e) => setForm({ ...form, institutionType: e.target.value })}
              className="border rounded p-2"
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="iti">ITI</option>
              <option value="polytechnic">Polytechnic</option>
              <option value="coaching">Coaching Institute</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Institution name"
            value={form.institutionName}
            onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
            className="w-full border rounded p-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Qualification (e.g. B.Tech, Class 12)"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Course / Stream"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Specialization (optional)"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Board / University"
              value={form.boardOrUniversity}
              onChange={(e) => setForm({ ...form, boardOrUniversity: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="number"
              placeholder="Start year"
              value={form.startYear}
              onChange={(e) => setForm({ ...form, startYear: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="number"
              placeholder="End year (if applicable)"
              value={form.endYear}
              onChange={(e) => setForm({ ...form, endYear: e.target.value })}
              className="border rounded p-2"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded p-2"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="discontinued">Discontinued</option>
              <option value="planned">Planned</option>
            </select>
            <input
              type="text"
              placeholder="Current class/semester/year"
              value={form.classOrStage}
              onChange={(e) => setForm({ ...form, classOrStage: e.target.value })}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Marks / Percentage / GPA (optional)"
              value={form.marksOrGPA}
              onChange={(e) => setForm({ ...form, marksOrGPA: e.target.value })}
              className="border rounded p-2 sm:col-span-2"
            />
          </div>

          <input
            type="text"
            placeholder="Achievements (comma-separated, optional)"
            value={form.achievements}
            onChange={(e) => setForm({ ...form, achievements: e.target.value })}
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : editingId ? 'Update Record' : 'Add Record'}
          </button>
        </form>
      )}

      {records.length === 0 && !showForm && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No education records yet — add your first one above.</p>
        </div>
      )}

      <div className="space-y-4">
        {records.map((record) => {
          const status = statusConfig[record.status];
          return (
            <div key={record._id} className="bg-white p-5 rounded-lg shadow relative pl-6 border-l-4 border-indigo-200">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 uppercase">
                    {levelLabels[record.educationLevel]}
                  </span>
                  <h2 className="font-bold text-lg">
                    {record.qualification || levelLabels[record.educationLevel]}
                    {record.course && ` — ${record.course}`}
                  </h2>
                  {record.institutionName && (
                    <p className="text-sm text-gray-600">{record.institutionName}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                {(record.startYear || record.endYear) && (
                  <span>📅 {record.startYear || '?'} – {record.status === 'ongoing' ? 'Present' : record.endYear || '?'}</span>
                )}
                {record.marksOrGPA && <span>📊 {record.marksOrGPA}</span>}
                {record.classOrStage && <span>📍 {record.classOrStage}</span>}
              </div>

              {record.achievements?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {record.achievements.map((a, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                      🏅 {a}
                    </span>
                  ))}
                </div>
              )}

              {record.notes && <p className="text-sm text-gray-600 mt-2 italic">{record.notes}</p>}

              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEdit(record)} className="text-xs text-gray-600 font-medium hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(record._id)} className="text-xs text-red-600 font-medium hover:underline">
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

export default EducationHistory;
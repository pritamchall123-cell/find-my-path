import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const statusConfig = {
  exploring: { label: 'Exploring', color: 'bg-purple-100 text-purple-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', color: 'bg-amber-100 text-amber-700' },
  achieved: { label: 'Achieved', color: 'bg-blue-100 text-blue-700' },
  dropped: { label: 'Dropped', color: 'bg-gray-200 text-gray-600' },
};

const priorityConfig = {
  high: { label: 'High priority', color: 'bg-red-50 text-red-700' },
  medium: { label: 'Medium priority', color: 'bg-yellow-50 text-yellow-700' },
  low: { label: 'Low priority', color: 'bg-gray-100 text-gray-600' },
};

const emptyForm = {
  career: '',
  priority: 'medium',
  status: 'exploring',
  targetDate: '',
  motivation: '',
  notes: '',
};

function CareerGoals() {
  const [goals, setGoals] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchGoals = async () => {
    try {
      const res = await axiosInstance.get('/goals');
      setGoals(res.data.goals);
    } catch (err) {
      setPageError('Could not load your goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    axiosInstance
      .get('/careers')
      .then((res) => setCareers(res.data.careers))
      .catch(() => {});
  }, []);

  const currentGoals = goals.filter((g) => ['exploring', 'active', 'paused'].includes(g.status));
  const pastGoals = goals.filter((g) => ['achieved', 'dropped'].includes(g.status));

  // Careers that already have a live goal can't be added twice
  const availableCareers = careers.filter(
    (c) => !goals.some((g) => g.career?._id === c._id && g.status !== 'dropped')
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleEdit = (goal) => {
    setForm({
      career: goal.career?._id || '',
      priority: goal.priority,
      status: goal.status,
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
      motivation: goal.motivation || '',
      notes: goal.notes || '',
    });
    setEditingId(goal._id);
    setShowForm(true);
    setFormError('');
    setNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');

    const payload = {
      priority: form.priority,
      status: form.status,
      targetDate: form.targetDate || null,
      motivation: form.motivation,
      notes: form.notes,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/goals/${editingId}`, payload);
      } else {
        await axiosInstance.post('/goals', { ...payload, career: form.career });
      }
      resetForm();
      fetchGoals();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const handleMakePrimary = async (goal) => {
    setPageError('');
    setNotice('');
    try {
      await axiosInstance.post(`/goals/${goal._id}/primary`);
      setNotice(
        `${goal.career?.name || 'This career'} is now your primary goal and your target career. ` +
          'Your skill gap and readiness pages now use it. If you want a roadmap for it, generate one on the Roadmap page.'
      );
      fetchGoals();
    } catch (err) {
      setPageError(err.response?.data?.message || 'Could not set primary goal');
    }
  };

  const handleDelete = async (goal) => {
    if (!confirm('Delete this goal? Consider marking it "Dropped" instead to keep it in your history.')) return;
    setPageError('');
    setNotice('');
    try {
      await axiosInstance.delete(`/goals/${goal._id}`);
      fetchGoals();
    } catch (err) {
      setPageError(err.response?.data?.message || 'Could not delete goal');
    }
  };

  const renderGoal = (goal) => {
    const status = statusConfig[goal.status];
    const priority = priorityConfig[goal.priority];
    const canBePrimary = ['exploring', 'active', 'paused'].includes(goal.status);

    return (
      <div
        key={goal._id}
        className={`bg-white p-5 rounded-lg shadow ${
          goal.isPrimary ? 'border-2 border-blue-500' : ''
        }`}
      >
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <div>
            {goal.isPrimary && (
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">
                ⭐ PRIMARY GOAL
              </span>
            )}
            <h2 className="font-bold text-lg mt-1">
              {goal.career ? (
                <Link to={`/careers/${goal.career._id}`} className="hover:underline">
                  {goal.career.name}
                </Link>
              ) : (
                'This career is no longer available'
              )}
            </h2>
            {goal.career?.category && (
              <p className="text-xs text-gray-500">{goal.career.category}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${priority.color}`}>
              {priority.label}
            </span>
          </div>
        </div>

        {goal.targetDate && (
          <p className="text-xs text-gray-500 mt-2">
            🎯 Target date:{' '}
            {new Date(goal.targetDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}

        {goal.motivation && (
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-semibold">Why: </span>
            {goal.motivation}
          </p>
        )}
        {goal.notes && <p className="text-sm text-gray-600 mt-1 italic">{goal.notes}</p>}

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs items-center">
          {goal.career && (
            <Link to={`/careers/${goal.career._id}`} className="text-blue-600 font-medium hover:underline">
              View requirements →
            </Link>
          )}
          {goal.isPrimary && (
            <>
              <Link to="/skill-gap" className="text-blue-600 font-medium hover:underline">
                Skill gap →
              </Link>
              <Link to="/roadmap" className="text-blue-600 font-medium hover:underline">
                Roadmap →
              </Link>
            </>
          )}
          {canBePrimary && !goal.isPrimary && (
            <button
              onClick={() => handleMakePrimary(goal)}
              className="text-blue-600 font-medium hover:underline"
            >
              Make primary
            </button>
          )}
          <button onClick={() => handleEdit(goal)} className="text-gray-600 font-medium hover:underline">
            Edit
          </button>
          {!goal.isPrimary && (
            <button onClick={() => handleDelete(goal)} className="text-red-600 font-medium hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <PageLoader message="Loading your goals..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">My Career Goals</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Keep more than one option open. Your primary goal is the one your roadmap and skill gap
        analysis follow. Goals you drop or achieve stay here as part of your history.
      </p>

      {pageError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{pageError}</div>}
      {notice && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{notice}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
          {formError && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{formError}</div>}

          {!editingId && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Career</label>
              <select
                value={form.career}
                onChange={(e) => setForm({ ...form, career: e.target.value })}
                required
                className="w-full border rounded p-2"
              >
                <option value="">Select a career...</option>
                {availableCareers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="exploring">Exploring</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="achieved">Achieved</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Target date (optional)</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <textarea
            placeholder="Why does this goal matter to you? (optional)"
            value={form.motivation}
            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
            maxLength={500}
            rows={2}
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            maxLength={1000}
            rows={2}
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : editingId ? 'Update Goal' : 'Save Goal'}
          </button>
        </form>
      )}

      {goals.length === 0 && !showForm && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-700 mb-2">You haven't added any career goals yet.</p>
          <p className="text-sm text-gray-500 mb-4">
            Not sure yet? That's fine. Browse careers first, and add a goal when something catches
            your interest.
          </p>
          <Link to="/directory" className="text-blue-600 font-medium hover:underline text-sm">
            Explore the Career Directory →
          </Link>
        </div>
      )}

      {currentGoals.length > 0 && (
        <div className="space-y-4 mb-8">{currentGoals.map(renderGoal)}</div>
      )}

      {pastGoals.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-1">Past goals</h2>
          <p className="text-xs text-gray-500 mb-3">
            Kept as part of your history. Changing direction is normal, not a failure.
          </p>
          <div className="space-y-4 opacity-90">{pastGoals.map(renderGoal)}</div>
        </div>
      )}
    </div>
  );
}

export default CareerGoals;
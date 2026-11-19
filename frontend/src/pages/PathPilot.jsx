import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const qualificationOptions = [
  { value: 'class10', label: 'Class 10' },
  { value: 'class12', label: 'Class 12' },
  { value: 'diploma', label: 'Diploma/Polytechnic' },
  { value: 'college', label: 'Currently in College' },
  { value: 'graduate', label: 'Graduate' },
];

function PathPilot() {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    currentQualification: 'class12',
    targetCareer: '',
    preferredLocation: '',
    maxBudgetPerYear: '',
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareIds, setCompareIds] = useState([]);
  const [showForm, setShowForm] = useState(true);

  const fetchScenarios = async () => {
    try {
      const res = await axiosInstance.get('/scenarios');
      setScenarios(res.data.scenarios);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axiosInstance.get('/careers').then((res) => setCareers(res.data.careers));
    fetchScenarios();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.targetCareer) {
      setError('Please select a target career');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      await axiosInstance.post('/scenarios', {
        name: form.name || undefined,
        currentQualification: form.currentQualification,
        targetCareer: form.targetCareer,
        preferredLocation: form.preferredLocation || undefined,
        maxBudgetPerYear: form.maxBudgetPerYear ? Number(form.maxBudgetPerYear) : undefined,
      });
      setForm({ name: '', currentQualification: 'class12', targetCareer: '', preferredLocation: '', maxBudgetPerYear: '' });
      setShowForm(false);
      fetchScenarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate scenario');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scenario?')) return;
    try {
      await axiosInstance.delete(`/scenarios/${id}`);
      fetchScenarios();
      setCompareIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegenerate = async (id) => {
    try {
      await axiosInstance.post(`/scenarios/${id}/regenerate`);
      fetchScenarios();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparedScenarios = scenarios.filter((s) => compareIds.includes(s._id));

  if (loading) return <PageLoader message="Loading PathPilot..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">🧭 PathPilot</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
        >
          {showForm ? 'Hide Form' : '+ New Scenario'}
        </button>
      </div>
      <p className="text-gray-600 mb-6">
        Try different "what if" combinations — qualification, career, location, budget — and see the real pathway each one opens.
      </p>

      {showForm && (
        <form onSubmit={handleGenerate} className="bg-white p-5 rounded-lg shadow mb-6 space-y-3">
          {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}

          <input
            type="text"
            placeholder="Scenario name (optional) — e.g. 'If I study locally'"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded p-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.currentQualification}
              onChange={(e) => setForm({ ...form, currentQualification: e.target.value })}
              className="border rounded p-2"
            >
              {qualificationOptions.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>

            <select
              value={form.targetCareer}
              onChange={(e) => setForm({ ...form, targetCareer: e.target.value })}
              className="border rounded p-2"
              required
            >
              <option value="">Select target career...</option>
              {careers.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Preferred location (optional) — e.g. Delhi"
              value={form.preferredLocation}
              onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
              className="border rounded p-2"
            />

            <input
              type="number"
              placeholder="Max budget per year in ₹ (optional)"
              value={form.maxBudgetPerYear}
              onChange={(e) => setForm({ ...form, maxBudgetPerYear: e.target.value })}
              className="border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
          >
            {generating ? 'Generating...' : '🧭 Generate Scenario'}
          </button>
        </form>
      )}

      {compareIds.length >= 2 && (
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-3">Comparing {compareIds.length} Scenarios</h2>
          <div className="overflow-x-auto">
            <div
              className="grid gap-4 min-w-max"
              style={{ gridTemplateColumns: `repeat(${comparedScenarios.length}, minmax(260px, 1fr))` }}
            >
              {comparedScenarios.map((s) => (
                <div key={s._id} className="bg-white p-4 rounded-lg shadow border-2 border-blue-200">
                  <h3 className="font-bold mb-1">{s.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">Target: {s.inputs.targetCareer?.name}</p>
                  <p className="text-xs"><strong>Steps:</strong> {s.result.steps.length}</p>
                  <p className="text-xs"><strong>Institutions found:</strong> {s.result.matchingInstitutions.length}</p>
                  <p className="text-xs"><strong>Scholarships:</strong> {s.result.relevantScholarshipCount}</p>
                  <p className="text-xs mt-2"><strong>Benefits:</strong></p>
                  <ul className="text-xs text-green-700 list-disc list-inside">
                    {s.result.benefits.slice(0, 2).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <p className="text-xs mt-1"><strong>Trade-offs:</strong></p>
                  <ul className="text-xs text-amber-700 list-disc list-inside">
                    {s.result.tradeoffs.slice(0, 2).map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {scenarios.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No scenarios yet — generate your first one above.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {scenarios.map((s) => (
            <div key={s._id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <h2 className="font-bold text-lg">{s.name}</h2>
                  <p className="text-sm text-gray-500">
                    {qualificationOptions.find((q) => q.value === s.inputs.currentQualification)?.label} →{' '}
                    {s.inputs.targetCareer?.name || 'Unknown career'}
                  </p>
                </div>
                <label className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={compareIds.includes(s._id)}
                    onChange={() => toggleCompare(s._id)}
                  />
                  Compare
                </label>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Pathway Steps</h3>
                <ol className="space-y-1">
                  {s.result.steps.map((step, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="font-bold text-blue-600">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {s.result.eligibilityNotes?.length > 0 && (
                <div className="mt-3 bg-amber-50 p-3 rounded text-xs text-amber-800 space-y-1">
                  {s.result.eligibilityNotes.map((n, i) => <p key={i}>⚠️ {n}</p>)}
                </div>
              )}

              {s.result.matchingInstitutions?.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Matching Institutions</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.result.matchingInstitutions.slice(0, 5).map((inst, i) => (
                      <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        {inst.name} {inst.approxFeesPerYear && `(${inst.approxFeesPerYear})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                💰 {s.result.relevantScholarshipCount} relevant scholarship(s) —{' '}
                <Link to="/scholarships" className="text-blue-600 hover:underline">view all →</Link>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-green-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-green-800 mb-1">👍 Benefits</h3>
                  <ul className="text-xs text-green-900 list-disc list-inside space-y-0.5">
                    {s.result.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <h3 className="text-xs font-semibold text-orange-800 mb-1">⚠️ Trade-offs</h3>
                  <ul className="text-xs text-orange-900 list-disc list-inside space-y-0.5">
                    {s.result.tradeoffs.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>

              {s.result.alternativeCareers?.length > 0 && (
                <div className="mt-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Alternative Careers</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.result.alternativeCareers.map((alt, i) => (
                      <Link
                        key={i}
                        to={`/careers/${alt.career}`}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-100"
                      >
                        {alt.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleRegenerate(s._id)}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  🔄 Regenerate with latest data
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PathPilot;
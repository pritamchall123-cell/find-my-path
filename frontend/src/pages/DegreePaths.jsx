import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const commonDegrees = [
  'B.Tech Computer Science',
  'B.Tech IT',
  'B.Tech Civil Engineering',
  'B.Tech Mechanical Engineering',
  'B.Tech Electrical/Electronics Engineering',
  'BCA',
  'BBA',
  'B.Com',
  'BA English/Journalism',
  'B.Sc Statistics',
  'B.Des',
  'MBBS',
  'Any Graduate',
];

function DegreePaths() {
  const [degree, setDegree] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('government');
  const [error, setError] = useState('');

  const handleSearch = async (selectedDegree) => {
    const query = selectedDegree || degree;
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/careers/by-degree', {
        params: { degree: query },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load career paths');
    } finally {
      setLoading(false);
    }
  };

  const list = result ? (tab === 'government' ? result.government : result.private) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Where Can Your Degree Take You?</h1>
      <p className="text-gray-600 mb-6">
        Your degree is a starting point, not a destination. Enter it to see both government and private paths it opens.
      </p>

      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g. B.Tech Computer Science"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-blue-600 text-white px-5 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {commonDegrees.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDegree(d);
                handleSearch(d);
              }}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {result && (
        <>
          <div className="flex justify-end mb-3">
            <Link
              to={`/institutions?degree=${encodeURIComponent(degree)}`}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              🎓 Find colleges offering this degree →
            </Link>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('government')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                tab === 'government' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              🏛️ Government ({result.government.length})
            </button>
            <button
              onClick={() => setTab('private')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                tab === 'private' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              🏢 Private ({result.private.length})
            </button>
          </div>

          {list.length === 0 && (
            <p className="text-gray-500">No matches found for this degree yet.</p>
          )}

          <div className="space-y-3">
            {list.map((c) => (
              <Link
                key={c._id}
                to={`/careers/${c._id}`}
                className="block bg-white p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  {c.examRequired && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      Exam: {c.examRequired}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{c.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  {c.approxStartingSalary && <span>💰 {c.approxStartingSalary}</span>}
                  {c.careerGrowth && <span>📈 {c.careerGrowth}</span>}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DegreePaths;
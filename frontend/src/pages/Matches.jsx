import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axiosInstance.get('/matches/me');
        setMatches(res.data.matches);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Analyzing your matches...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Career Matches</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {matches.map((m) => (
          <div key={m.careerId} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{m.name}</h2>
              <span className="text-blue-600 font-bold">{m.compatibility}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${m.compatibility}%` }}
              ></div>
            </div>

            {m.explanation && (
              <p className="text-gray-700 text-sm mb-3">{m.explanation}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {m.breakdown.map((b, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.status === 'strong'
                      ? 'bg-green-100 text-green-700'
                      : b.status === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {b.skill}: {b.status}
                </span>
              ))}
            </div>

            <Link
              to={`/careers/${m.careerId}`}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View Career Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
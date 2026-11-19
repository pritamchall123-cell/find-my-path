import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

function StatePortalDirectory() {
  const [portals, setPortals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/scholarships/state-portals')
      .then((res) => setPortals(res.data.portals))
      .finally(() => setLoading(false));
  }, []);

  const filtered = portals.filter((p) =>
    p.stateOrUT.toLowerCase().includes(search.toLowerCase())
  );

  const states = filtered.filter((p) => p.type === 'state');
  const uts = filtered.filter((p) => p.type === 'union_territory');

  if (loading) return <PageLoader message="Loading state portals..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <Link to="/scholarships" className="text-sm text-blue-600 hover:underline">← Back to Scholarships</Link>
      <h1 className="text-3xl font-bold mt-2 mb-2">State & UT Scholarship Portals</h1>
      <p className="text-gray-600 mb-2">
        A discovery map of official portals — not individually verified scholarship listings. Each state may have several department portals and schemes; always confirm the exact current application route on the official site.
      </p>
      <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg mb-6">
        ⚠️ These links are starting points for discovery, not a claim that every portal currently has an open application.
      </div>

      <input
        type="text"
        placeholder="Search by state or UT..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded p-2 bg-white mb-6"
      />

      <h2 className="font-bold text-lg mb-3">States ({states.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {states.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{p.stateOrUT}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {p.portals.map((portal, i) => (
                <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                  {portal.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-3">Union Territories ({uts.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {uts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{p.stateOrUT}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {p.portals.map((portal, i) => (
                <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                  {portal.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-gray-500">No state/UT matches your search.</p>}
    </div>
  );
}

export default StatePortalDirectory;
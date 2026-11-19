import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const levelLabels = {
  class10: 'Class 10',
  class12: 'Class 12',
  diploma: 'Diploma/ITI',
  college: 'College/UG',
  graduate: 'Graduate',
};

const providerLabels = {
  central_government: 'Central Govt',
  state_government: 'State Govt',
  private: 'Private',
  foundation: 'Foundation',
  university: 'University',
  other: 'Other',
};

const statusConfig = {
  open: { label: 'Open', color: 'bg-green-100 text-green-700' },
  upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' },
  expected: { label: 'Expected (unconfirmed)', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Closed', color: 'bg-gray-200 text-gray-700' },
  paused: { label: 'Paused', color: 'bg-orange-100 text-orange-700' },
  discontinued: { label: 'Discontinued', color: 'bg-red-100 text-red-700' },
  unverified: { label: 'Status Unverified', color: 'bg-amber-100 text-amber-700' },
};

function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchScholarships = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = {};
      const level = overrides.level !== undefined ? overrides.level : levelFilter;
      const provider = overrides.provider !== undefined ? overrides.provider : providerFilter;
      const state = overrides.state !== undefined ? overrides.state : stateFilter;
      if (level) params.educationLevel = level;
      if (provider) params.providerType = provider;
      if (state) params.state = state;

      const res = await axiosInstance.get('/scholarships', { params });
      setScholarships(res.data.scholarships);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const clearFilters = () => {
    setLevelFilter('');
    setProviderFilter('');
    setStateFilter('');
    fetchScholarships({ level: '', provider: '', state: '' });
  };

  const hasFilters = levelFilter || providerFilter || stateFilter;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
        <h1 className="text-3xl font-bold">Scholarships & Financial Aid</h1>
        <div className="flex gap-3">
          <Link
            to="/scholarships/finder"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
          >
            🔍 Find My Matches
          </Link>
          <Link
            to="/scholarships/states"
            className="text-sm text-indigo-600 font-medium hover:underline whitespace-nowrap self-center"
          >
            🗺️ State Portals →
          </Link>
        </div>
      </div>
      <p className="text-gray-600 mb-6">
        Real government and private scholarship programs, with honest status tracking — we show "Status Unverified" rather than guessing.
      </p>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-2">
        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            fetchScholarships({ level: e.target.value });
          }}
          className="border rounded p-2 text-sm"
        >
          <option value="">All Education Levels</option>
          {Object.entries(levelLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={providerFilter}
          onChange={(e) => {
            setProviderFilter(e.target.value);
            fetchScholarships({ provider: e.target.value });
          }}
          className="border rounded p-2 text-sm"
        >
          <option value="">All Providers</option>
          {Object.entries(providerLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="State (e.g. West Bengal)"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchScholarships()}
          onBlur={() => fetchScholarships()}
          className="border rounded p-2 text-sm flex-1 min-w-[150px]"
        />

        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear filters
          </button>
        )}
      </div>

      {loading && <PageLoader message="Loading scholarships..." />}

      {!loading && scholarships.length === 0 && (
        <p className="text-gray-500">No scholarships found for this filter combination.</p>
      )}

      <div className="space-y-4">
        {scholarships.map((s) => {
          const status = statusConfig[s.applicationStatus] || statusConfig.unverified;
          return (
            <div key={s._id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <h2 className="font-bold text-lg">{s.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {providerLabels[s.providerType]}
                </span>
                {s.educationLevels?.map((lvl, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {levelLabels[lvl] || lvl}
                  </span>
                ))}
              </div>

              {s.providerName && <p className="text-sm text-gray-500 mt-2">By {s.providerName}</p>}

              {s.benefitAmount && (
                <p className="text-sm text-gray-700 mt-2">
                  💰 {s.benefitAmount}
                  {s.benefitFrequency && s.benefitFrequency !== 'not_specified' && ` (${s.benefitFrequency.replace('_', ' ')})`}
                </p>
              )}

              {s.eligibleCategories?.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Eligibility:</strong> {s.eligibleCategories.join(', ')}
                </p>
              )}

              {s.eligibleStates?.length > 0 && !s.eligibleStates.includes('All India') && (
                <p className="text-xs text-gray-600 mt-1">
                  <strong>States:</strong> {s.eligibleStates.join(', ')}
                </p>
              )}

              {(s.applicationStartDate || s.applicationDeadline) && (
                <p className="text-xs text-gray-500 mt-2">
                  📅 {s.applicationStartDate && `Opens: ${s.applicationStartDate}`}
                  {s.applicationStartDate && s.applicationDeadline && ' · '}
                  {s.applicationDeadline && `Closes: ${s.applicationDeadline}`}
                </p>
              )}

              {s.verificationNotes && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded mt-2">
                  ⚠️ {s.verificationNotes}
                </p>
              )}

              <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                <p className="text-[11px] text-gray-400">
                  {s.lastVerifiedAt
                    ? `Last verified: ${new Date(s.lastVerifiedAt).toLocaleDateString()}`
                    : 'Not independently verified by FindMyPath — confirm on official source'}
                  {s.academicYear && ` · AY ${s.academicYear}`}
                </p>
                {s.officialApplicationUrl && (
                  <a
                    href={s.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Visit Official Portal →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Scholarships;
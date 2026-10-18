import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const levelLabels = {
  class10: 'Class 10',
  class12: 'Class 12',
  college: 'College',
  graduate: 'Graduate',
};

function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchScholarships = async (level) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/scholarships', {
        params: level ? { educationLevel: level } : {},
      });
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

  const handleFilter = (level) => {
    setLevelFilter(level);
    fetchScholarships(level);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Scholarships & Financial Aid</h1>
      <p className="text-gray-600 mb-6">
        Real government and private scholarship programs — always verify current amounts and deadlines on the official site before applying.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleFilter('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            levelFilter === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          All
        </button>
        {Object.entries(levelLabels).map(([level, label]) => (
          <button
            key={level}
            onClick={() => handleFilter(level)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              levelFilter === level ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <PageLoader message="Loading scholarships..." />}

      {!loading && scholarships.length === 0 && (
        <p className="text-gray-500">No scholarships found for this filter.</p>
      )}

      <div className="space-y-4">
        {scholarships.map((s) => (
          <div key={s._id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <h2 className="font-bold text-lg">{s.name}</h2>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap">
                {s.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">By {s.provider}</p>

            {s.awardDetails && (
              <p className="text-sm text-gray-700 mt-3">💰 {s.awardDetails}</p>
            )}

            {s.eligibilityCriteria?.length > 0 && (
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Eligibility</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                  {s.eligibilityCriteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {(s.applicationOpens || s.applicationCloses) && (
              <p className="text-xs text-gray-500 mt-3">
                📅 {s.applicationOpens && `Opens: ${s.applicationOpens}`}
                {s.applicationOpens && s.applicationCloses && ' · '}
                {s.applicationCloses && `Closes: ${s.applicationCloses}`}
              </p>
            )}

            <p className="text-[11px] text-amber-600 mt-3">
              ⚠️ Amount and deadline details change yearly — verify current figures on the official portal before applying.
            </p>

            {s.applicationUrl && (
              <a
                href={s.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium hover:underline mt-3 inline-block"
              >
                Visit Official Portal →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scholarships;
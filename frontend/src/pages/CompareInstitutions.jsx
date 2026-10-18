import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

function CompareInstitutions() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axiosInstance.get('/institutions');
        const all = res.data.institutions;
        const selected = ids.map((id) => all.find((i) => i._id === id)).filter(Boolean);
        setInstitutions(selected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (ids.length > 0) fetchAll();
  }, []);

  if (loading) return <PageLoader message="Loading comparison..." />;
  if (institutions.length === 0) return <p className="p-8 text-gray-500">No institutions selected.</p>;

  const field = (value, fallback = 'Not listed') => value || fallback;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-2">Compare Colleges</h1>
      <p className="text-gray-600 mb-6 text-sm">
        A side-by-side view to help you decide — missing information is labeled clearly rather than guessed.
      </p>

      <div className="overflow-x-auto">
        <div
          className="grid gap-4 min-w-max"
          style={{ gridTemplateColumns: `repeat(${institutions.length}, minmax(280px, 1fr))` }}
        >
          {institutions.map((inst) => (
            <div key={inst._id} className="bg-white p-5 rounded-lg shadow">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {inst.type}
              </span>
              <h2 className="text-lg font-bold mt-2 mb-3">{inst.name}</h2>

              <h3 className="font-semibold text-xs text-gray-500 uppercase mb-1">Location</h3>
              <p className="text-sm mb-3">
                {field(inst.location?.city)}, {field(inst.location?.state)}
              </p>

              <h3 className="font-semibold text-xs text-gray-500 uppercase mb-1">Degrees Offered</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {inst.degreesOffered?.length > 0 ? (
                  inst.degreesOffered.map((d, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 italic">Not listed</span>
                )}
              </div>

              <h3 className="font-semibold text-xs text-gray-500 uppercase mb-1">Approx. Fees</h3>
              <p className="text-sm mb-3">{field(inst.approxFeesPerYear)}</p>

              <h3 className="font-semibold text-xs text-gray-500 uppercase mb-1">Notable For</h3>
              <p className="text-sm mb-3">{field(inst.notableFor)}</p>

              <h3 className="font-semibold text-xs text-gray-500 uppercase mb-1">Data Status</h3>
              <p className="text-sm mb-3">
                {inst.dataProvenance?.verificationStatus === 'verified' ? (
                  <span className="text-green-700">✅ Verified</span>
                ) : (
                  <span className="text-amber-700">⚠️ Unverified — check official website</span>
                )}
              </p>

              {inst.website && (
                <a
                  href={inst.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Visit Website →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompareInstitutions;
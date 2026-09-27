import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Compare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const results = await Promise.all(
          ids.map((id) => axiosInstance.get(`/careers/${id}`))
        );
        setCareers(results.map((r) => r.data.career));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (ids.length > 0) fetchCareers();
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Loading comparison...</p>;
  if (careers.length === 0) return <p className="p-8 text-gray-500">No careers selected.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Compare Careers</h1>
      <p className="text-gray-600 mb-6 text-sm">
        This is a side-by-side view to help you understand the differences — there's no "better" option, only what fits you.
      </p>

      <div className="overflow-x-auto">
        <div
          className="grid gap-4 min-w-max"
          style={{ gridTemplateColumns: `repeat(${careers.length}, minmax(280px, 1fr))` }}
        >
          {careers.map((career) => (
            <div key={career._id} className="bg-white p-5 rounded-lg shadow">
              <span className="text-xs font-semibold text-blue-600 uppercase">
                {career.category}
              </span>
              <h2 className="text-lg font-bold mt-1 mb-3">{career.name}</h2>

              <p className="text-gray-700 text-sm mb-4">{career.description}</p>

              <h3 className="font-semibold text-sm mb-1">Core Skills</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {career.coreSkills?.map((cs, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {cs.skill?.name}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold text-sm mb-1">Responsibilities</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-4 space-y-1">
                {career.responsibilities?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <h3 className="font-semibold text-sm mb-1">Entry-Level Roles</h3>
              <p className="text-sm text-gray-700 mb-4">
                {career.entryLevelRoles?.join(', ')}
              </p>

              <h3 className="font-semibold text-sm mb-1">Example Projects</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {career.exampleProjects?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Compare;
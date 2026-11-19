import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

function SectorDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/directory/sectors/${slug}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Sector not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageLoader message="Loading sector..." />;
  if (error) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <p className="text-gray-500">{error}</p>
        <Link to="/directory" className="text-blue-600 hover:underline">← Back to Career Directory</Link>
      </div>
    );
  }

  const nonEmptyCategories = data.categories.filter((c) => c.careers.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/directory" className="hover:underline">Career Directory</Link>
        {' / '}
        <span className="text-gray-700">{data.sector.name}</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{data.sector.icon}</span>
        <h1 className="text-3xl font-bold">{data.sector.name}</h1>
      </div>
      <p className="text-gray-600 mb-8">{data.sector.description}</p>

      {nonEmptyCategories.length === 0 && (
        <p className="text-gray-500">No careers classified under this sector yet.</p>
      )}

      {nonEmptyCategories.map((cat) => (
        <div key={cat._id} className="mb-8">
          <h2 className="text-xl font-bold mb-3">{cat.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cat.careers.map((career) => (
              <Link
                key={career._id}
                to={`/careers/${career._id}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold">{career.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {career.sector === 'both' ? 'Govt+Private' : career.sector}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{career.description}</p>
                {career.approxStartingSalary && (
                  <p className="text-xs text-gray-500 mt-2">💰 {career.approxStartingSalary}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SectorDetail;
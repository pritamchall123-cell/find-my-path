import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

function CareerDirectory() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/directory/sectors')
      .then((res) => setSectors(res.data.sectors))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Loading Career Directory..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Career Directory</h1>
      <p className="text-gray-600 mb-8">
        Browse careers organized by sector — from IT and design to government and healthcare.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sectors.map((sector) => (
          <Link
            key={sector._id}
            to={`/directory/${sector.slug}`}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all hover:-translate-y-1 duration-300"
          >
            <div className="text-4xl mb-3">{sector.icon}</div>
            <h2 className="font-bold text-lg mb-2">{sector.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{sector.description}</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>{sector.careerCount} career{sector.careerCount !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>{sector.categoryCount} categor{sector.categoryCount !== 1 ? 'ies' : 'y'}</span>
            </div>
            <span className="text-indigo-600 text-sm font-semibold mt-3 inline-block">
              Explore Careers →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CareerDirectory;
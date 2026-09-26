import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await axiosInstance.get('/careers');
        setCareers(res.data.careers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Explore Careers</h1>

      {loading && <p className="text-gray-500">Loading careers...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map((career) => (
          <Link
            key={career._id}
            to={`/careers/${career._id}`}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition block"
          >
            <span className="text-xs font-semibold text-blue-600 uppercase">
              {career.category}
            </span>
            <h2 className="text-lg font-bold mt-1">{career.name}</h2>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {career.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Careers;
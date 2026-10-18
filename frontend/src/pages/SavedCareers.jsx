import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function SavedCareers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await axiosInstance.get('/skillgap/saved');
      setCareers(res.data.savedCareers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (careerId) => {
    try {
      await axiosInstance.post('/skillgap/save', { careerId });
      setCareers((prev) => prev.filter((c) => c._id !== careerId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Saved Careers</h1>
      <p className="text-gray-600 mb-6">Careers you've bookmarked to revisit later.</p>

      {careers.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You haven't saved any careers yet.</p>
          <Link to="/careers" className="text-blue-600 font-medium hover:underline">
            Browse Careers →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careers.map((career) => (
          <div key={career._id} className="bg-white p-5 rounded-lg shadow relative">
            <button
              onClick={() => handleUnsave(career._id)}
              className="absolute top-4 right-4 text-lg"
              title="Remove from saved"
            >
              🔖
            </button>
            <Link to={`/careers/${career._id}`} className="block pr-10">
              <span className="text-xs font-semibold text-blue-600 uppercase">
                {career.category}
              </span>
              <h2 className="text-lg font-bold mt-1">{career.name}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{career.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedCareers;
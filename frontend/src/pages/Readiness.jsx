import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const categoryLabels = {
  technology: 'Technology',
  data: 'Data',
  creative: 'Creative',
  analytical: 'Analytical',
  'people-oriented': 'People Skills',
  general: 'General',
};

function Readiness() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        const res = await axiosInstance.get('/skillgap/readiness');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load readiness data');
      } finally {
        setLoading(false);
      }
    };
    fetchReadiness();
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Career Readiness</h1>
      <p className="text-gray-600 mb-6">
        Target: <span className="font-semibold">{data.career}</span>
      </p>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Overall Readiness</h2>
          <span className="text-2xl font-bold text-blue-600">{data.overallReadiness}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${data.overallReadiness}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This reflects your self-rated skill confidence, not a guarantee of job readiness — use it as a planning guide.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold mb-2">By Skill Area</h2>
        {data.categories.map((c) => (
          <div key={c.category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{categoryLabels[c.category] || c.category}</span>
              <span className="text-gray-600">{c.readiness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${c.readiness}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Readiness;
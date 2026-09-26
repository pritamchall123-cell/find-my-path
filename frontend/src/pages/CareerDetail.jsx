import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingTarget, setSettingTarget] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await axiosInstance.get(`/careers/${id}`);
        setCareer(res.data.career);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  const handleSetTarget = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSettingTarget(true);
    setMessage('');
    try {
      await axiosInstance.post('/skillgap/target', { careerId: id });
      setMessage('Target career set! Go to your dashboard to generate a roadmap.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSettingTarget(false);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (!career) return <p className="p-8 text-gray-500">Career not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <span className="text-xs font-semibold text-blue-600 uppercase">{career.category}</span>
      <h1 className="text-3xl font-bold mt-1 mb-4">{career.name}</h1>
      <p className="text-gray-700 mb-6">{career.description}</p>

      {career.responsibilities?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Typical Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {career.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {career.coreSkills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Core Skills</h2>
          <div className="flex flex-wrap gap-2">
            {career.coreSkills.map((cs, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                {cs.skill?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {career.entryLevelRoles?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Entry-Level Roles</h2>
          <p className="text-gray-700">{career.entryLevelRoles.join(', ')}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
      )}

      <button
        onClick={handleSetTarget}
        disabled={settingTarget}
        className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {settingTarget ? 'Setting...' : 'Set as My Target Career'}
      </button>
    </div>
  );
}

export default CareerDetail;
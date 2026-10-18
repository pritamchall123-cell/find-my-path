import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import MilestonesWidget from '../components/MilestonesWidget';
import EducationPlanWidget from '../components/EducationPlanWidget';

function Dashboard() {
  const [roadmap, setRoadmap] = useState(null);
  const [hasTarget, setHasTarget] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/roadmap/me');
        setRoadmap(res.data.roadmap);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'No roadmap yet');
      }

      try {
        const profileRes = await axiosInstance.get('/profile/me');
        setHasTarget(!!profileRes.data.profile?.targetCareer);
      } catch (err) {
        setHasTarget(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedCount = roadmap
    ? roadmap.steps.filter((s) => s.status === 'completed').length
    : 0;
  const totalSteps = roadmap ? roadmap.steps.length : 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name || 'Student'} 👋</h1>

      <MilestonesWidget />
      <EducationPlanWidget />
      
      {loading && <p className="text-gray-500 mt-4">Loading your dashboard...</p>}

      {!loading && !roadmap && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          {hasTarget ? (
            <>
              <p className="text-gray-700 mb-4">
                You've set a target career — now generate your personalized roadmap.
              </p>
              <Link
                to="/roadmap"
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
              >
                Generate My Roadmap
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{errorMsg || 'You haven\'t set up a roadmap yet.'}</p>
              <Link
                to="/careers"
                className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
              >
                Explore Careers
              </Link>
            </>
          )}
        </div>
      )}

      {!loading && roadmap && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-1">
            Target: {roadmap.targetCareer?.name || 'Career'}
          </h2>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-3 mb-1">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {completedCount}/{totalSteps} steps completed ({progressPercent}%)
          </p>

          <Link
            to="/roadmap"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 inline-block"
          >
            View Full Roadmap
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
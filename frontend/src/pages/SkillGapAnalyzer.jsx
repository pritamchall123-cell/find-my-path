import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PageLoader from '../components/PageLoader';

const statusConfig = {
  completed: { label: 'Completed (evidenced)', color: 'bg-green-100 text-green-700', icon: '✅' },
  in_progress: { label: 'In Progress (evidenced)', color: 'bg-blue-100 text-blue-700', icon: '🔧' },
  self_reported: { label: 'Self-Reported', color: 'bg-amber-100 text-amber-700', icon: '📝' },
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-600', icon: '⭕' },
};

function SkillGapAnalyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    const fetchGap = async () => {
      try {
        const res = await axiosInstance.get('/skillgap/gap');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load skill gap analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchGap();
  }, []);

  if (loading) return <PageLoader message="Analyzing your skill gaps..." />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
        <p className="text-gray-700">{error}</p>
        <Link to="/careers" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
          Explore careers to set a target →
        </Link>
      </div>
    );
  }

  const notStartedOrSelfReported = data.gaps.filter(
    (g) => g.status === 'not_started' || g.status === 'self_reported'
  );
  const priorityList = notStartedOrSelfReported
    .slice()
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
      <p className="text-gray-600 mb-4">
        Target: <span className="font-semibold">{data.career}</span>
      </p>

      <button
        onClick={() => setShowMethodology((prev) => !prev)}
        className="text-sm text-blue-600 font-medium hover:underline mb-6"
      >
        {showMethodology ? 'Hide' : 'How is this calculated?'}
      </button>

      {showMethodology && (
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 mb-6">{data.methodology}</div>
      )}

      {priorityList.length > 0 && (
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="font-bold text-lg mb-3">🎯 Suggested Priority Skills</h2>
          <p className="text-sm text-gray-600 mb-3">
            These are the highest-weighted skills you haven't evidenced yet — start here.
          </p>
          <div className="space-y-2">
            {priorityList.map((g, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span className="font-medium">{g.skill}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[g.status].color}`}>
                  {statusConfig[g.status].icon} {statusConfig[g.status].label}
                </span>
              </div>
            ))}
          </div>
          <Link to="/portfolio" className="text-sm text-blue-600 font-medium hover:underline mt-3 inline-block">
            + Add a portfolio entry to start evidencing these →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {data.gaps.map((g, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div>
                <span className="font-semibold">{g.skill}</span>
                {g.required && <span className="text-xs text-gray-400 ml-2">(core)</span>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusConfig[g.status].color}`}>
                {statusConfig[g.status].icon} {statusConfig[g.status].label}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${g.readiness}%` }}
              ></div>
            </div>

            {g.evidence?.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Evidence:{' '}
                {g.evidence.map((e, ei) => (
                  <span key={ei}>
                    {e.title}
                    {ei < g.evidence.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillGapAnalyzer;